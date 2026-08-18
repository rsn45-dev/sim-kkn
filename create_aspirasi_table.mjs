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
    CREATE TABLE IF NOT EXISTS aspirasi (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      tanggal DATE NOT NULL,
      judul VARCHAR(255) NOT NULL,
      isi TEXT NOT NULL,
      status ENUM('draft', 'terkirim', 'direspon') DEFAULT 'draft',
      respon TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  
  // also add menu if not exists
  try {
    await pool.execute("INSERT INTO menus (name, url, icon, access_role, order_num) VALUES ('Aspirasi', '/dashboard/aspirasi', 'MenuSquare', 'user', 4)");
    await pool.execute("INSERT INTO menus (name, url, icon, access_role, order_num) VALUES ('Aspirasi', '/dashboard/aspirasi', 'MenuSquare', 'admin', 4)");
  } catch(e) {}

  console.log("aspirasi table created!");
  process.exit(0);
}

run().catch(console.error);
