const pool = require('../../dbConfig');

class BaseModel {
    static async query(sql, params) {
        const result = await pool.query(sql, params);
        return result.rows;
    }

    static async querySingle(sql, params) {
        const result = await pool.query(sql, params);
        return result.rows[0];
    }
}

module.exports = BaseModel;