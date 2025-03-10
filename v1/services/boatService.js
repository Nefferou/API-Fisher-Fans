const BoatRepository = require('../repositories/boatRepository');
const GeneralCheckers = require('../checkers/generalCheckers');
const SpecificCheckers = require('../checkers/specificCheckers');
const {boatRequiredFields} = require('../checkers/requiredFieldsList');

class Boat {
    static async createBoat (data){
        await GeneralCheckers.checkRequiredFields(data, boatRequiredFields);
        await this.validateBoatData(data.owner, data.licence_type, data.equipments);
        return await this.saveBoatData(data);
    }

    static async updateBoat (id, data){
        await GeneralCheckers.checkRequiredFields(data, boatRequiredFields);
        await GeneralCheckers.checkBoatExists(id);
        await this.validateBoatData(data.owner, data.licence_type, data.equipments);
        return await this.saveBoatData(data, id);
    }

    static async patchBoat (id, data){
        await GeneralCheckers.checkBoatExists(id);
        const result = await BoatRepository.patchBoatDetails(id, data);
        if (data.equipments) {
            await this.validateEquipments(data.equipments);
            await BoatRepository.deleteBoatEquipments(id);
            await BoatRepository.associateEquipmentToBoat(result.id, data.equipments);
        }
        return result;
    }

    static async deleteBoat (id){
        await GeneralCheckers.checkBoatExists(id);
        return await BoatRepository.deleteBoat(id);
    }

    static async getBoat (id){
        await GeneralCheckers.checkBoatExists(id);
        const result = await BoatRepository.getBoat(id);
        result.equipments = await BoatRepository.fetchBoatEquipments(id);
        result.owner = await BoatRepository.fetchBoatOwner(id);
        return result;
    }

    static async getAllBoats (filters){
        if (filters.ownerId) {
            await GeneralCheckers.checkUserExistsById(filters.ownerId, 'Propriétaire');
        }

        const result = await BoatRepository.getAllBoats(filters);

        for (const boat of result) {
            boat.equipments = await BoatRepository.fetchBoatEquipments(boat.id);
            boat.owner = await BoatRepository.fetchBoatOwner(boat.id);
        }

        return result;
    }

    static async validateBoatData(owner, licence_type, equipments) {
        await GeneralCheckers.checkUserExistsById(owner, 'Propriétaire');
        await SpecificCheckers.checkUserBoatLicense(owner, licence_type);
        await this.validateEquipments(equipments);
    }

    static async validateEquipments(equipments) {
        for (const equipment of equipments) {
            await GeneralCheckers.checkEquipmentExists(equipment);
        }
    }

    static async saveBoatData(data, id = null) {
        const { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power, owner, equipments } = data;
        let result;
        if (id) {
            result = await BoatRepository.updateBoatDetails(id, { name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power });
            await BoatRepository.deleteBoatAssociations(id);
        } else {
            result = await BoatRepository.insertBoat({ name, description, boat_type, picture, licence_type, bail, max_capacity, city, longitude, latitude, motor_type, motor_power });
        }
        await BoatRepository.associateBoatToUser(result.id, owner);
        await BoatRepository.associateEquipmentToBoat(result.id, equipments);
        return result;
    }
}

module.exports = Boat;
