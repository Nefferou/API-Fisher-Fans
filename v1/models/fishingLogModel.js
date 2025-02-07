const pool = require('../../dbConfig');
const GeneralCheckers = require('../../utils/generalCheckers');

const FishingLog = {
    createLog: async (data) => {
        const { fish_name, picture, comment, height, weight, location, date, freed, owner } = data;

        await GeneralCheckers.checkUserExistsById(owner);

        const result = await pool.query(
            `INSERT INTO fishing_logs (fish_name, picture, comment, height, weight, location, date, freed)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [fish_name, picture, comment, height, weight, location, date, freed]
        );

        await FishingLog.associateLogToUser(result.rows[0].id, owner);

        return result.rows[0];
    },

    updateLog: async (id, data) => {
        const { fish_name, picture, comment, height, weight, location, date, freed, owner } = data;

        await GeneralCheckers.checkLogExists(id);

        const result = await pool.query(
            `UPDATE fishing_logs SET fish_name = $1, picture = $2, comment = $3, height = $4, weight = $5, location = $6, date = $7, freed = $8
            WHERE id = $9 RETURNING *`,
            [fish_name, picture, comment, height, weight, location, date, freed, id]
        );

        await pool.query('DELETE FROM user_logs WHERE log_id = $1', [id]);
        await FishingLog.associateLogToUser(id, owner);

        return result.rows[0];
    },

    patchLog: async (id, data) => {
        await GeneralCheckers.checkLogExists(id);

        const { fish_name, picture, comment, height, weight, location, date, freed, owner } = data;
        const result = await pool.query(
            `UPDATE fishing_logs
            SET fish_name = COALESCE($1, fish_name), picture = COALESCE($2, picture), comment = COALESCE($3, comment),
            height = COALESCE($4, height), weight = COALESCE($5, weight), location = COALESCE($6, location),
            date = COALESCE($7, date), freed = COALESCE($8, freed)
            WHERE id = $9 RETURNING *`,
            [fish_name, picture, comment, height, weight, location, date, freed, id]
        );

        if (owner) {
            await GeneralCheckers.checkUserExistsById(owner);
            await pool.query('DELETE FROM user_logs WHERE log_id = $1', [id]);
            await FishingLog.associateLogToUser(id, owner);
        }

        return result.rows[0];
    },

    deleteLog: async (id) => {
        await GeneralCheckers.checkLogExists(id);
        await pool.query('DELETE FROM user_logs WHERE log_id = $1', [id]);
        const result = await pool.query('DELETE FROM fishing_logs WHERE id = $1', [id]);
        return result.rowCount;
    },

    getLog: async (id) => {
        await GeneralCheckers.checkLogExists(id);
        const result = await pool.query('SELECT * FROM fishing_logs WHERE id = $1', [id]);
        result.rows[0].user = await FishingLog.fetchLogOwner(id);
        return result.rows[0];
    },

    getAllLogs: async (filters) => {
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
                }
                else {
                    query += ` ${key} = $${index + 1}`;
                }
                values.push(filters[key]);
                if (index < Object.keys(filters).length - 1) query += ' AND';
            });
        }


        const result = await pool.query(query, values);

        for (const log of result.rows) {
            log.user = await FishingLog.fetchLogOwner(log.id);
        }

        return result.rows;
    },

    fetchLogOwner: async (logId) => {
        const owner = await pool.query('SELECT user_id FROM user_logs WHERE log_id = $1', [logId]);
        return owner.rows[0].user_id;
    },

    associateLogToUser: async (logId, userId) => {
        await pool.query('INSERT INTO user_logs (user_id, log_id) VALUES ($1, $2)', [userId, logId]);
    }
};

module.exports = FishingLog;
