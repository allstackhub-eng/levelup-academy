const mysql = require('mysql2/promise');

let pool;

function getPool() {
  if (!pool) {
    const url = new URL(process.env.DATABASE_URL);
    pool = mysql.createPool({
      host: url.hostname,
      port: url.port,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

module.exports = { getPool };
