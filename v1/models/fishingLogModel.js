const pool = require('../../dbConfig');

const FishingLog = {
    createLog: async (data) => {
        const { trip, date, log } = data;
        const result = await pool.query(
            `INSERT INTO fishing_logs (trip, date, log)
             VALUES ($1, $2, $3) RETURNING *`,
            [trip, date, log]
        );
        return result.rows[0];
    },

    updateLog: async (id, data) => {
        const { trip, date, log } = data;
        const result = await pool.query(
            `UPDATE fishing_logs SET trip = $1, date = $2, log = $3
             WHERE id = $4 RETURNING *`,
            [trip, date, log, id]
        );
        return result.rows[0];
    },

    deleteLog: async (id) => {
        const result = await pool.query('DELETE FROM fishing_logs WHERE id = $1', [id]);
        return result.rowCount;
    },

    getLog: async (id) => {
        const result = await pool.query('SELECT * FROM fishing_logs WHERE id = $1', [id]);
        return result.rows[0];
    },

    getAllLogs: async () => {
        const result = await pool.query('SELECT * FROM fishing_logs');
        return result.rows;
    }
};

module.exports = FishingLog;
