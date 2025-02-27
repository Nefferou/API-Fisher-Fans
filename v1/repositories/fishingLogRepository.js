const BaseRepository = require("../repositories/baseRepository");

class FishingLogRepository extends BaseRepository {
    static async insertLog(data) {
        const { fish_name, picture, comment, height, weight, location, date, freed } = data;
        return await this.querySingle(
            `INSERT INTO fishing_logs (fish_name, picture, comment, height, weight, location, date, freed)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [fish_name, picture, comment, height, weight, location, date, freed]
        );
    }

    static async updateLogDetails(id, data) {
        const { fish_name, picture, comment, height, weight, location, date, freed } = data;
        return await this.querySingle(
            `UPDATE fishing_logs SET fish_name = $1, picture = $2, comment = $3, height = $4, weight = $5, location = $6, date = $7, freed = $8
             WHERE id = $9 RETURNING *`,
            [fish_name, picture, comment, height, weight, location, date, freed, id]
        );
    }

    static async patchLogDetails(id, data) {
        const { fish_name, picture, comment, height, weight, location, date, freed } = data;
        return await this.querySingle(
            `UPDATE fishing_logs
             SET fish_name = COALESCE($1, fish_name), picture = COALESCE($2, picture), comment = COALESCE($3, comment),
                 height = COALESCE($4, height), weight = COALESCE($5, weight), location = COALESCE($6, location),
                 date = COALESCE($7, date), freed = COALESCE($8, freed)
             WHERE id = $9 RETURNING *`,
            [fish_name, picture, comment, height, weight, location, date, freed, id]
        );
    }

    static async deleteLog(id) {
        await this.querySingle('DELETE FROM user_logs WHERE log_id = $1', [id]);
        return await this.querySingle('DELETE FROM fishing_logs WHERE id = $1', [id]);
    }

    static async getLog(id) {
        return await this.querySingle('SELECT * FROM fishing_logs WHERE id = $1', [id]);
    }

    static async getAllLogs(query, values) {
        return await this.query(query, values);
    }

    static async fetchLogOwner(logId) {
        const owner = await this.querySingle('SELECT user_id FROM user_logs WHERE log_id = $1', [logId]);
        return owner.user_id;
    }

    static async associateLogToUser(logId, userId) {
        await this.querySingle('INSERT INTO user_logs (user_id, log_id) VALUES ($1, $2)', [userId, logId]);
    }

    static async deleteLogAssociations(logId) {
        await this.querySingle('DELETE FROM user_logs WHERE log_id = $1', [logId]);
    }
}

module.exports = FishingLogRepository;