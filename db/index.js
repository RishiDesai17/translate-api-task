const mysql = require("mysql2/promise");

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "translationcache",
};

if (process.env.NODE_ENV === "development") {
    config["port"] = process.env.DB_PORT;
}

const pool = mysql.createPool(config);

const executeQuery = async (sql, params) => {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
};

module.exports = {
    executeQuery,
};