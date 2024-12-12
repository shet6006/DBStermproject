const fs = require("fs");
const connection = require("./db_connect");

const SQL_FILE = "./schema.sql";

function initializeDatabase(callback) {
  console.log("데이터베이스 초기화 작업을 시작합니다.");

  connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\`;`,
    (err) => {
      if (err) {
        console.error("오류가 발생했습니다.");
        connection.end();
        return;
      }

      console.log("데이터베이스가 생성되었습니다.");

      connection.changeUser({ database: process.env.DB_DATABASE }, (err) => {
        if (err) {
          console.error("오류가 발생했습니다.");
          connection.end();
          return;
        }

        console.log("데이터베이스를 사용합니다.");

        fs.readFile(SQL_FILE, "utf8", (err, sql) => {
          if (err) {
            console.error("오류가 발생했습니다.");
            connection.end();
            return;
          }

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

function executeStatements(statements, index, callback) {
  if (index >= statements.length) {
    console.log("데이터베이스와 테이블이 성공적으로 초기화되었습니다.");
    if (callback) callback();
    return;
  }

  connection.query(statements[index], (err) => {
    if (err) {
      console.error("오류가 발생했습니다.");
      connection.end();
      return;
    }
    executeStatements(statements, index + 1, callback);
  });
}

module.exports = initializeDatabase;
