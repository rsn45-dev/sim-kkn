require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function initDB() {
  console.log("Connecting to TiDB...");
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '4000', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });

  try {
    console.log("Creating users table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        gender ENUM('L', 'P') NOT NULL,
        dob DATE NOT NULL,
        address TEXT NOT NULL,
        job_status VARCHAR(100) NOT NULL,
        marital_status VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
        rejection_reason TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating menus table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS menus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) DEFAULT NULL,
        url VARCHAR(255) DEFAULT NULL,
        parent_id INT DEFAULT NULL,
        order_num INT DEFAULT 0,
        access_role VARCHAR(100) DEFAULT 'all',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE CASCADE
      )
    `);

    console.log("Inserting default menus...");
    // Check if menus are empty
    const [rows] = await connection.execute('SELECT count(*) as count FROM menus');
    if (rows[0].count === 0) {
      await connection.execute(`
        INSERT INTO menus (name, icon, url, order_num, access_role) VALUES
        ('Dashboard', 'Activity', '/dashboard', 1, 'all'),
        ('Data Warga', 'Users', '/dashboard/warga', 2, 'all'),
        ('Laporan Stunting', 'FileText', '/dashboard/laporan', 3, 'all'),
        ('Manajemen User', 'UserCog', '/dashboard/users', 4, 'admin'),
        ('Manajemen Menu', 'MenuSquare', '/dashboard/menus', 5, 'admin')
      `);
    }

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing DB:", error);
  } finally {
    await connection.end();
  }
}

initDB();
