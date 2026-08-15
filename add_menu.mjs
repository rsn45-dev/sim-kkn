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

  try {
    await pool.execute("INSERT INTO menus (name, url, icon, access_role, order_num) VALUES ('Laporan', '/dashboard/laporan', 'FileText', 'admin', 3)");
    console.log("Menu added");
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      console.log("Menu Laporan already exists");
    } else {
      console.error(e);
    }
  }
  process.exit(0);
}
run();
