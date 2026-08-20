require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function alterDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '4000', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });

  try {
    await connection.execute(`
      ALTER TABLE users 
      ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
      ADD COLUMN rejection_reason TEXT DEFAULT NULL
    `);
    console.log("Database altered successfully.");
  } catch (error) {
    console.error("Error altering DB:", error);
  } finally {
    await connection.end();
  }
}

alterDB();
