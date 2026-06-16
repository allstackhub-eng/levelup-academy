require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDB() {
  const url = new URL(process.env.DATABASE_URL);
  const conn = await mysql.createConnection({
    host: url.hostname,
    port: url.port,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false }
  });

  console.log('Connected to MySQL. Creating tables...');

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(255) UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      avatar VARCHAR(10) DEFAULT '🧑‍💻',
      theme VARCHAR(20) DEFAULT 'cosmic',
      parent_pin VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS progress (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      xp INT DEFAULT 0,
      level INT DEFAULT 1,
      streak INT DEFAULT 0,
      last_active DATE DEFAULT NULL,
      lessons_completed JSON DEFAULT ('[]'),
      quizzes_passed JSON DEFAULT ('[]'),
      projects_completed JSON DEFAULT ('[]'),
      saved_code JSON DEFAULT ('{}'),
      lesson_tab_state JSON DEFAULT ('{}'),
      hints_used JSON DEFAULT ('{}'),
      weekly_activity JSON DEFAULT ('{}'),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS achievements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      achievement_id VARCHAR(50) NOT NULL,
      earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_achievement (user_id, achievement_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS duels (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      difficulty VARCHAR(10) NOT NULL,
      challenge_id VARCHAR(50),
      user_code TEXT,
      result ENUM('win', 'loss', 'forfeit') NOT NULL,
      xp_earned INT DEFAULT 0,
      time_taken INT DEFAULT 0,
      played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS friend_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      friend_id INT NOT NULL,
      status ENUM('pending', 'accepted') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_friendship (user_id, friend_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('All tables created successfully!');
  await conn.end();
}

initDB().catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});
