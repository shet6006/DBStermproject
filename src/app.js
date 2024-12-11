const readline = require("readline-sync");
const connection = require("./db_connect");

// 회원 추가
function addMember() {
  const name = readline.question("회원 이름: ");
  const email = readline.question("이메일: ");
  const contact = readline.question("연락처: ");
  const joinDate = readline.question("가입 날짜 (YYYY-MM-DD): ");
  const position = readline.question("직책: ");
  const status = readline.question("회원 상태: ");

  const query = `
    INSERT INTO 회원 (회원_이름, 이메일, 연락처, 가입_날짜, 직책, 회원_상태)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  connection.query(query, [name, email, contact, joinDate, position, status], (err) => {
    if (err) {
      console.error("회원 추가 중 오류:", err.message);
    } else {
      console.log("회원이 성공적으로 추가되었습니다.");
    }
  });
}

// 회원 목록 조회
function viewMembers() {
  connection.query("SELECT * FROM 회원", (err, rows) => {
    if (err) {
      console.error("회원 조회 중 오류:", err.message);
    } else if (rows.length === 0) {
      console.log("회원 데이터가 없습니다.");
    } else {
      rows.forEach((row) => {
        console.log(`회원ID: ${row.회원ID}, 이름: ${row.회원_이름}, 이메일: ${row.이메일}`);
      });
    }
  });
}

// 메인 메뉴
function mainMenu() {
  console.log("데이터베이스 초기화 중...");
  require("./createDatabase")(() => {
    while (true) {
      console.log("\n동아리 관리 시스템");
      console.log("1. 회원 추가");
      console.log("2. 회원 목록 조회");
      console.log("3. 종료");

      const choice = readline.questionInt("선택: ");
      switch (choice) {
        case 1:
          addMember();
          break;
        case 2:
          viewMembers();
          break;
        case 3:
          console.log("시스템 종료.");
          connection.end();
          return;
        default:
          console.log("잘못된 선택입니다. 다시 시도하세요.");
      }
    }
  });
}

// 애플리케이션 실행
mainMenu();
