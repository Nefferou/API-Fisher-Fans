const FishingLogRepository = require('../repositories/fishingLogRepository');
const GeneralCheckers = require('../../utils/generalCheckers');

class FishingLog {
    static async createLog (data) {
        await this.validateLogData(data);
        const result = await FishingLogRepository.insertLog(data);
        await FishingLogRepository.associateLogToUser(result.id, data.owner);
        return result;
    }

    static async updateLog (id, data){
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
        let query = 'SELECT * FROM fishing_logs';
        const values = [];

        if (filters.ownerId) {
            await GeneralCheckers.checkUserExistsById(filters.ownerId);
        }

        if (Object.keys(filters).length > 0) {
            query += ' WHERE';
            Object.keys(filters).forEach((key, index) => {
                if (key === 'ownerId') {
                    query += ` id IN (SELECT log_id FROM user_logs WHERE user_id = $${index + 1})`;
                } else {
                    query += ` ${key} = $${index + 1}`;
                }
                values.push(filters[key]);
                if (index < Object.keys(filters).length - 1) query += ' AND';
            });
        }

        const result = await FishingLogRepository.getAllLogs(query, values);

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
