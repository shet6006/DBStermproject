const mysql = require('mysql2');
require('dotenv').config();

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err.message);
    process.exit(1);
  }
});

module.exports = connection;
