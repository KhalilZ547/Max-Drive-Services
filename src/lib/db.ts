import mysql from 'mysql2/promise';

// This is a basic connection pool setup. In a real-world production app,
// you might want to handle connection errors and retries more robustly.
const pool = mysql.createPool({
  // It's crucial to use environment variables for database credentials
  // and not hard-code them in your source code.
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
