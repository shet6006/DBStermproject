const connection = require('./db_connect');

// 데이터베이스 이름
const DB_NAME = process.env.DB_DATABASE || 'SimpleDB';

// 데이터베이스 생성 및 테이블 생성 함수
function initializeDatabase() {
  // 데이터베이스 생성
  connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`, (err) => {
    if (err) {
      console.error('데이터베이스 생성 오류:', err.message);
      connection.end();
      return;
    }
    console.log(`데이터베이스 '${DB_NAME}'가 생성되었습니다.`);

    // 데이터베이스 사용
    connection.changeUser({ database: DB_NAME }, (err) => {
      if (err) {
        console.error('데이터베이스 선택 오류:', err.message);
        connection.end();
        return;
      }
      console.log(`데이터베이스 '${DB_NAME}'를 사용합니다.`);

      // 테이블 생성
      createTables();
    });
  });
}

// 간단한 테이블 생성 쿼리
const queries = [
  `CREATE TABLE IF NOT EXISTS Member (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    join_date DATE
  );`,
  `CREATE TABLE IF NOT EXISTS Club (
    club_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS Membership (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    club_id INT NOT NULL
  );`
];

// 테이블 생성 함수
function createTables() {
  for (const query of queries) {
    connection.query(query, (err) => {
      if (err) {
        console.error('테이블 생성 중 오류:', err.message);
      } else {
        console.log('테이블 생성 성공!');
      }
    });
  }

  // 연결 종료
  connection.end(() => {
    console.log('데이터베이스 연결이 종료되었습니다.');
  });
}

// 데이터베이스 초기화 실행
initializeDatabase();
