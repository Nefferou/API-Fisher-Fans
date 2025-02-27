const FishingTripRepository = require('../repositories/fishingTripRepository');
const GeneralCheckers = require('../checkers/generalCheckers');
const SpecificCheckers = require('../checkers/specificCheckers');
const {fishingTripRequiredFields} = require('../checkers/requiredFieldsList');

class FishingTrip {
    static async createTrip (data) {
        await GeneralCheckers.checkRequiredFields(data, fishingTripRequiredFields);
        await this.validateTripData(data);
        const result = await FishingTripRepository.insertTrip(data);
        await FishingTripRepository.associateTripToBoat(result.id, data.boat);
        await FishingTripRepository.associateTripToUser(result.id, data.organiser);
        return result;
    }

    static async updateTrip (id, data) {
        await GeneralCheckers.checkRequiredFields(data, fishingTripRequiredFields);
        await GeneralCheckers.checkTripExists(id);
        await this.validateTripData(data);
        const result = await FishingTripRepository.updateTripDetails(id, data);
        await FishingTripRepository.deleteTripAssociations(id);
        await FishingTripRepository.associateTripToBoat(id, data.boat);
        await FishingTripRepository.associateTripToUser(id, data.organiser);
        return result;
    }

    static async patchTrip (id, data) {
        await GeneralCheckers.checkTripExists(id);
        const currentTrip = await this.getTrip(id);
        const result = await FishingTripRepository.patchTripDetails(id, data);
        if (data.boat) {
            await GeneralCheckers.checkBoatExists(data.boat);
            await SpecificCheckers.checkOwnership(currentTrip.organiser, data.boat);
            await FishingTripRepository.deleteTripAssociations(id);
            await FishingTripRepository.associateTripToBoat(id, data.boat);
            result.boat = data.boat;
        }
        if (data.organiser) {
            await GeneralCheckers.checkUserExistsById(data.organiser, 'Organisateur');
            await SpecificCheckers.checkOwnership(data.organiser, currentTrip.boat);
            await FishingTripRepository.deleteTripAssociations(id);
            await FishingTripRepository.associateTripToUser(id, data.organiser);
            result.organiser = data.organiser;
        }

        return result;
    }

    static async deleteTrip (id) {
        await GeneralCheckers.checkTripExists(id);
        return await FishingTripRepository.deleteTrip(id);
    }

    static async getTrip (id) {
        await GeneralCheckers.checkTripExists(id);
        const result = await FishingTripRepository.getTrip(id);
        result.organiser = await FishingTripRepository.fetchTripOrganiser(id);
        result.boat = await FishingTripRepository.fetchTripBoat(id);
        result.passengers = await FishingTripRepository.fetchTripPassengers(id);
        return result;
    }

    static async getAllTrips (filters) {
        if (filters.organiserId) {
            await GeneralCheckers.checkUserExistsById(filters.organiserId, 'Organisateur');
        }
        if (filters.boatId) {
            await GeneralCheckers.checkBoatExists(filters.boatId);
        }

        const result = await FishingTripRepository.getAllTrips(filters);

        for (const trip of result) {
            trip.organiser = await FishingTripRepository.fetchTripOrganiser(trip.id);
            trip.boat = await FishingTripRepository.fetchTripBoat(trip.id);
            trip.passengers = await FishingTripRepository.fetchTripPassengers(trip.id);
        }

        return result;
    }

    static async validateTripData(data) {
        await GeneralCheckers.checkUserExistsById(data.organiser, 'Organisateur');
        await GeneralCheckers.checkBoatExists(data.boat);
        await SpecificCheckers.checkOwnership(data.organiser, data.boat);
    }
}

module.exports = FishingTrip;
