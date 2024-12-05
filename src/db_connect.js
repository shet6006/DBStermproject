const mysql = require('mysql2');
require('dotenv').config();

// MySQL 연결 설정 (데이터베이스 이름 제외)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// 연결 시도
connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err.message);
    process.exit(1);
  } else {
    console.log('MySQL 서버에 연결되었습니다.');
  }
});

module.exports = connection;
