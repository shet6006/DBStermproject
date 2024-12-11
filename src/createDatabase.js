const fs = require("fs");
const connection = require("./db_connect"); // DB 연결 설정

// SQL 파일 경로
const SQL_FILE = "./schema.sql";

// 데이터베이스 초기화 함수
function initializeDatabase(callback) {
  console.log("데이터베이스 초기화 작업을 시작합니다.");

  // 데이터베이스 생성
  connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`,
    (err) => {
      if (err) {
        console.error("데이터베이스 생성 중 오류:", err.message);
        connection.end();
        return;
      }

      console.log(`데이터베이스 '${process.env.DB_DATABASE}'가 생성되었습니다.`);

      // 데이터베이스 사용
      connection.changeUser({ database: process.env.DB_DATABASE }, (err) => {
        if (err) {
          console.error("데이터베이스 선택 중 오류:", err.message);
          connection.end();
          return;
        }

        console.log(`데이터베이스 '${process.env.DB_DATABASE}'를 사용합니다.`);

        // SQL 파일 읽기
        fs.readFile(SQL_FILE, "utf8", (err, sql) => {
          if (err) {
            console.error("SQL 파일 읽기 중 오류 발생:", err.message);
            connection.end();
            return;
          }

          // SQL 명령 실행
          const statements = sql
            .split(";")
            .map((stmt) => stmt.trim())
            .filter((stmt) => stmt);
          executeStatements(statements, 0, callback);
        });
      });
    }
  );
}

// SQL 명령을 순차적으로 실행
function executeStatements(statements, index, callback) {
  if (index >= statements.length) {
    console.log("데이터베이스와 테이블이 성공적으로 초기화되었습니다.");
    if (callback) callback(); // 모든 작업 완료 후 콜백 호출
    return;
  }

  const statement = statements[index];
  console.log(`실행 중: ${statement}`);

  connection.query(statement, (err) => {
    if (err) {
      console.error("SQL 실행 중 오류 발생:", err.message);
      connection.end();
      return;
    }
    executeStatements(statements, index + 1, callback);
  });
}

// 모듈 내보내기
module.exports = initializeDatabase;
