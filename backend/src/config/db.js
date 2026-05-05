const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "saas_template_store",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
    throw error;
  }
};

module.exports = { pool, testConnection };
