const FishingLogRepository = require('../repositories/fishingLogRepository');
const GeneralCheckers = require('../checkers/generalCheckers');
const {fishingLogRequiredFields} = require('../checkers/requiredFieldsList');

class FishingLog {
    static async createLog (data) {
        await GeneralCheckers.checkRequiredFields(data, fishingLogRequiredFields);
        await this.validateLogData(data);
        const result = await FishingLogRepository.insertLog(data);
        await FishingLogRepository.associateLogToUser(result.id, data.owner);
        return result;
    }

    static async updateLog (id, data){
        await GeneralCheckers.checkRequiredFields(data, fishingLogRequiredFields);
        await GeneralCheckers.checkLogExists(id);
        await this.validateLogData(data);
        const result = await FishingLogRepository.updateLogDetails(id, data);
        await FishingLogRepository.deleteLogAssociations(id);
        await FishingLogRepository.associateLogToUser(id, data.owner);
        return result;
    }

    static async patchLog (id, data){
        await GeneralCheckers.checkLogExists(id);
        const result = await FishingLogRepository.patchLogDetails(id, data);
        if (data.owner) {
            await GeneralCheckers.checkUserExistsById(data.owner);
            await FishingLogRepository.deleteLogAssociations(id);
            await FishingLogRepository.associateLogToUser(id, data.owner);
        }

        return result;
    }

    static async deleteLog (id){
        await GeneralCheckers.checkLogExists(id);
        return await FishingLogRepository.deleteLog(id);
    }

    static async getLog (id) {
        await GeneralCheckers.checkLogExists(id);
        const result = await FishingLogRepository.getLog(id);
        result.user = await FishingLogRepository.fetchLogOwner(id);
        return result;
    }

    static async getAllLogs (filters) {
        if (filters.ownerId) {
            await GeneralCheckers.checkUserExistsById(filters.ownerId);
        }

        const result = await FishingLogRepository.getAllLogs(filters);

        for (const log of result) {
            log.owner = await FishingLogRepository.fetchLogOwner(log.id);
        }

        return result;
    }

    static async validateLogData(data) {
        await GeneralCheckers.checkUserExistsById(data.owner);
    }
}

module.exports = FishingLog;
