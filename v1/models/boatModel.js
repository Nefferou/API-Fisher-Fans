const BaseModel = require("./baseModel");
const GeneralCheckers = require('../../utils/generalCheckers');
const SpecificCheckers = require('../../utils/specificCheckers');

class Boat extends BaseModel {
    static async createBoat (data){
        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, owner, equipments } = data;
        await GeneralCheckers.checkUserExistsById(owner, 'Propriétaire');
        await SpecificCheckers.checkUserBoatLicense(owner, licence_type);
        equipments.forEach(equipment => {
            GeneralCheckers.checkEquipmentExists(equipment);
        });

        const result = await this.querySingle(
            `INSERT INTO boats (name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power]
        );
        await this.associateBoatToUser(result.id, owner);
        await this.associateEquipmentToBoat(result.id, equipments);
        return result;
    }

    static async updateBoat (id, data){
        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, owner, equipments } = data;
        await GeneralCheckers.checkBoatExists(id);
        await SpecificCheckers.checkUserBoatLicense(owner, licence_type);
        equipments.forEach(equipment => {
            GeneralCheckers.checkEquipmentExists(equipment);
        });

        const result = await this.querySingle(
            `UPDATE boats SET name = $1, description = $2, boat_type = $3, picture = $4, licence_type = $5, bail = $6, max_capacity = $7, city = $8, longitude = $9, latitude = $10, motor_type = $11, motor_power = $12
             WHERE id = $13 RETURNING *`,
            [name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, id]
        );
        await this.querySingle('DELETE FROM boat_equipments WHERE boat_id = $1', [id]);
        await this.querySingle('DELETE FROM user_boats WHERE boat_id = $1', [id]);
        await this.associateBoatToUser(result.id, owner);
        await this.associateEquipmentToBoat(result.id, equipments);
        return result;
    }

    static async patchBoat (id, data){
        await GeneralCheckers.checkBoatExists(id);

        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, equipments } = data;
        const result = await this.querySingle(
            `UPDATE boats SET name = COALESCE($1, name), description = COALESCE($2, description), boat_type = COALESCE($3, boat_type), picture = COALESCE($4, picture), licence_type = COALESCE($5, licence_type), bail = COALESCE($6, bail), max_capacity = COALESCE($7, max_capacity), city = COALESCE($8, city), longitude = COALESCE($9, longitude), latitude = COALESCE($10, latitude), motor_type = COALESCE($11, motor_type), motor_power = COALESCE($12, motor_power)
             WHERE id = $13 RETURNING *`,
            [name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, id]
        );
        if (equipments) {
            equipments.forEach(equipment => {
                GeneralCheckers.checkEquipmentExists(equipment);
            });
            await this.querySingle('DELETE FROM boat_equipments WHERE boat_id = $1', [id]);
            await this.associateEquipmentToBoat(result.id, equipments);
        }
        return result;
    }

    static async deleteBoat (id){
        await GeneralCheckers.checkBoatExists(id);

        await this.querySingle('DELETE FROM boat_equipments WHERE boat_id = $1', [id]);
        await this.querySingle('DELETE FROM user_boats WHERE boat_id = $1', [id]);

        return await this.querySingle('DELETE FROM boats WHERE id = $1', [id]);
    }

    static async getBoat (id){
        await GeneralCheckers.checkBoatExists(id);

        const result = await this.querySingle('SELECT * FROM boats WHERE id = $1', [id]);

        result.equipments = await this.fetchBoatEquipments(id);
        result.owner = await this.fetchBoatOwner(id);

        return result;
    }

    static async getAllBoats (filters){
        let query = 'SELECT * FROM boats';
        const values = [];
        const conditions = [];

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

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        if (filters.ownerId) {
            await GeneralCheckers.checkUserExistsById(filters.ownerId, 'Propriétaire');

            query += conditions.length > 0 ? ' AND ' : ' WHERE ';
            query += 'id IN (SELECT boat_id FROM user_boats WHERE user_id = $' + (values.length + 1) + ')';
            values.push(filters.ownerId);
        }

        const result = await this.query(query, values);

        for (const boat of result) {
            boat.equipments = await this.fetchBoatEquipments(boat.id);
        }

        for (const boat of result) {
            boat.owner = await this.fetchBoatOwner(boat.id);
        }

        return result;
    }

    static async fetchBoatOwner (boatId){
        const owner = await this.querySingle('SELECT user_id FROM user_boats WHERE boat_id = $1', [boatId]);
        return owner.user_id;
    }

    static async fetchBoatEquipments (boatId){
        const equipments = await this.query(
            `SELECT e.* FROM equipments e
             JOIN boat_equipments be ON e.id = be.equipment_id
             WHERE be.boat_id = $1`,
            [boatId]
        );
        return equipments.map(equipment => equipment.id);
    }

    static async associateBoatToUser (boatId, userId){
        await this.querySingle(
            `INSERT INTO user_boats (boat_id, user_id)
             VALUES ($1, $2) RETURNING *`,
            [boatId, userId]
        );
    }

    static async associateEquipmentToBoat (boatId, equipments) {
        const existingEquipments = await this.query('SELECT * FROM boat_equipments WHERE boat_id = $1', [boatId]);
        const existingEquipmentsIds = existingEquipments.map(equipment => equipment.equipment_id);

        const equipmentsIds = [];
        for (const equipment of equipments) {
            const result = await this.querySingle('SELECT id FROM equipments WHERE name = $1', [equipment]);
            if (result.rowCount > 0) {
                equipmentsIds.push(result.id);
            }
        }

        const newEquipments = equipmentsIds.filter(equipment => !existingEquipmentsIds.includes(equipment));

        for (const equipmentId of newEquipments) {
            await this.querySingle(
                `INSERT INTO boat_equipments (boat_id, equipment_id)
                 VALUES ($1, $2)`,
                [boatId, equipmentId]
            );
        }
    }
}

module.exports = Boat;
