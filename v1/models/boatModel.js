const pool = require('../../dbConfig');
const AppError = require('../../utils/AppError');

const Boat = {
    createBoat: async (data) => {
        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, owner, equipments } = data;
        // Check if the owner exists and has a valid boat_license
        const checkOwner = await pool.query('SELECT * FROM users WHERE id = $1', [owner]);
        // Give the error to the catch block in the controller
        if (checkOwner.rowCount === 0) {
            throw new AppError('Ce propriétaire n\'existe pas', 404);
        }
        if (!checkOwner.rows[0].boat_license) {
            throw new AppError('Pas de permis bateau valide', 403);
        }
        const result = await pool.query(
            `INSERT INTO boats (name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power]
        );
        await Boat.associateBoatToUser(result.rows[0].id, owner);
        await Boat.associateEquipmentToBoat(result.rows[0].id, equipments);
        return result.rows[0];
    },

    updateBoat: async (id, data) => {
        // Check if the boat exists
        const checkBoat = await pool.query('SELECT * FROM boats WHERE id = $1', [id]);
        if (checkBoat.rowCount === 0) {
            throw new AppError('Bateau non trouvé', 404);
        }
        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, owner, equipments } = data;
        const result = await pool.query(
            `UPDATE boats SET name = $1, description = $2, boat_type = $3, picture = $4, licence_type = $5, bail = $6, max_capacity = $7, city = $8, longitude = $9, latitude = $10, motor_type = $11, motor_power = $12
             WHERE id = $13 RETURNING *`,
            [name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, id]
        );
        await Boat.associateBoatToUser(result.rows[0].id, owner);
        await Boat.associateEquipmentToBoat(result.rows[0].id, equipments);
        return result.rows[0];
    },

    patchBoat: async (id, data) => {
        // Check if the boat exists
        const checkBoat = await pool.query('SELECT * FROM boats WHERE id = $1', [id]);
        if (checkBoat.rowCount === 0) {
            throw new AppError('Bateau non trouvé', 404);
        }
        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, equipments } = data;
        const result = await pool.query(
            `UPDATE boats SET name = COALESCE($1, name), description = COALESCE($2, description), boat_type = COALESCE($3, boat_type), picture = COALESCE($4, picture), licence_type = COALESCE($5, licence_type), bail = COALESCE($6, bail), max_capacity = COALESCE($7, max_capacity), city = COALESCE($8, city), longitude = COALESCE($9, longitude), latitude = COALESCE($10, latitude), motor_type = COALESCE($11, motor_type), motor_power = COALESCE($12, motor_power)
             WHERE id = $13 RETURNING *`,
            [name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, id]
        );
        if (equipments) {
            await Boat.associateEquipmentToBoat(result.rows[0].id, equipments);
        }
        return result.rows[0];
    },

    deleteBoat: async (id) => {
        // Check if the boat exists
        const checkBoat = await pool.query('SELECT * FROM boats WHERE id = $1', [id]);
        if (checkBoat.rowCount === 0) {
            throw new AppError('Bateau non trouvé', 404);
        }

        // Delete the boat from the boat_equipments table first
        await pool.query('DELETE FROM boat_equipments WHERE boat_id = $1', [id]);

        // Delete the boat from the user_boats table first
        await pool.query('DELETE FROM user_boats WHERE boat_id = $1', [id]);

        const result = await pool.query('DELETE FROM boats WHERE id = $1', [id]);
        return result.rowCount;
    },

    getBoat: async (id) => {
        const result = await pool.query('SELECT * FROM boats WHERE id = $1', [id]);

        // Fetch the equipments for the boat
        result.rows[0].equipments = await Boat.fetchBoatEquipments(id);

        // Fetch the owner for the boat
        result.rows[0].owner = await Boat.fetchBoatOwner(id);

        return result.rows[0];
    },

    getAllBoats: async (filters) => {
        // base query
        let query = 'SELECT * FROM boats';
        const values = [];
        const conditions = [];

        // if ownerId mentioned, check if the user exists
        if (filters.ownerId) {
            const checkOwner = await pool.query('SELECT * FROM users WHERE id = $1', [filters.ownerId]);
            if (checkOwner.rowCount === 0) {
                throw new AppError('Propriétaire non trouvé', 404);
            }
        }

        // filters minLatitude, maxLatitude, minLongitude, maxLongitude (ownerId is in another table)
        Object.entries(filters).forEach(([key, value]) => {
            if (key === 'minLatitude') {
                conditions.push(`latitude >= $${values.length + 1}`);
                values.push(value);
            } else if (key === 'maxLatitude') {
                conditions.push(`latitude <= $${values.length + 1}`);
                values.push(value);
            } else if (key === 'minLongitude') {
                conditions.push(`longitude >= $${values.length + 1}`);
                values.push(value);
            } else if (key === 'maxLongitude') {
                conditions.push(`longitude <= $${values.length + 1}`);
                values.push(value);
            }
        });

        // add conditions for the location to the query
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // join with the user_boats table to filter by ownerId if mentioned
        if (filters.ownerId) {
            query += conditions.length > 0 ? ' AND ' : ' WHERE ';
            query += 'id IN (SELECT boat_id FROM user_boats WHERE user_id = $' + (values.length + 1) + ')';
            values.push(filters.ownerId);
        }

        // execute the query
        const result = await pool.query(query, values);

        // Fetch the equipments for each boat
        for (const boat of result.rows) {
            boat.equipments = await Boat.fetchBoatEquipments(boat.id);
        }

        // Fetch the owner for each boat
        for (const boat of result.rows) {
            boat.owner = await Boat.fetchBoatOwner(boat.id);
        }

        return result.rows;
    },

    fetchBoatOwner: async (boatId) => {
        const owner = await pool.query('SELECT user_id FROM user_boats WHERE boat_id = $1', [boatId]);
        return owner.rows[0].user_id;
    },

    fetchBoatEquipments: async (boatId) => {
        const equipments = await pool.query(
            `SELECT e.* FROM equipments e
             JOIN boat_equipments be ON e.id = be.equipment_id
             WHERE be.boat_id = $1`,
            [boatId]
        );
        return equipments.rows.map(equipment => equipment.id);
    },

    associateBoatToUser: async (boatId, userId) => {
        await pool.query(
            `INSERT INTO user_boats (boat_id, user_id)
             VALUES ($1, $2) RETURNING *`,
            [boatId, userId]
        );
    },

    associateEquipmentToBoat: async (boatId, equipments) => {
        // Check existing equipments to avoid duplicates in the boat_equipments table
        const existingEquipments = await pool.query('SELECT * FROM boat_equipments WHERE boat_id = $1', [boatId]);
        const existingEquipmentsIds = existingEquipments.rows.map(equipment => equipment.equipment_id);

        // Fetch the equipments IDS
        const equipmentsIds = [];
        for (const equipment of equipments) {
            const result = await pool.query('SELECT id FROM equipments WHERE name = $1', [equipment]);
            if (result.rowCount > 0) {
                equipmentsIds.push(result.rows[0].id);
            }
        }

        // Filter out existing equipments from the equipments array
        const newEquipments = equipmentsIds.filter(equipment => !existingEquipmentsIds.includes(equipment));

        // Insert new equipments in the boat_equipments table
        for (const equipmentId of newEquipments) {
            await pool.query(
                `INSERT INTO boat_equipments (boat_id, equipment_id)
                 VALUES ($1, $2)`,
                [boatId, equipmentId]
            );
        }
    }
};

module.exports = Boat;
