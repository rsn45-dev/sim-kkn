import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '4000', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS guest_health_checks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      child_name VARCHAR(255) NOT NULL,
      gender ENUM('L', 'P') NOT NULL,
      dob DATE NOT NULL,
      weight_kg DECIMAL(5,2) NOT NULL,
      height_cm DECIMAL(5,2) NOT NULL,
      measurement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("guest_health_checks table created!");
  process.exit(0);
}

run().catch(console.error);
