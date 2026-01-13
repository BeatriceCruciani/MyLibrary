/**
 * Configurazione pool MySQL (mysql2/promise).
 * Il pool gestisce connessioni riutilizzabili (performance + stabilità).
 */
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
