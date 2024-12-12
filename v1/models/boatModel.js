const pool = require('../../dbConfig');

const Boat = {
    createBoat: async (data) => {
        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, owner, equipments } = data;
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
        // Delete the boat from the boat_equipments table first
        await pool.query('DELETE FROM boat_equipments WHERE boat_id = $1', [id]);

        // Delete the boat from the user_boats table first
        await pool.query('DELETE FROM user_boats WHERE boat_id = $1', [id]);

        const result = await pool.query('DELETE FROM boats WHERE id = $1', [id]);
        return result.rowCount;
    },

    getBoat: async (id) => {
        const result = await pool.query('SELECT * FROM boats WHERE id = $1', [id]);
        return result.rows[0];
    },

    getAllBoats: async () => {
        const result = await pool.query('SELECT * FROM boats');
        return result.rows;
    },

    associateBoatToUser: async (boatId, userId) => {
        const result = await pool.query(
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
