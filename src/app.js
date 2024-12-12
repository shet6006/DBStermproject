const readline = require("readline-sync");
const connection = require("./db_connect");

// 회원 관련 함수들
function addMember() {
  console.log("\n=== 회원 추가 ===");
  const name = readline.question("회원 이름: ");
  const email = readline.question("이메일: ");
  const contact = readline.question("연락처: ");
  const joinDate = readline.question("가입일 (YYYY-MM-DD): ");
  const position = readline.question("직책: ");
  const status = readline.question("회원 상태 (활동중/비활동중): ");

  const query = `
    INSERT INTO Member (MemberID, MemberName, Email, Contact, JoinDate, Position, MemberStatus)
    VALUES ((SELECT MAX(MemberID) + 1 FROM Member m), ?, ?, ?, ?, ?, ?);
  `;

  connection.query(query, [name, email, contact, joinDate, position, status], (err) => {
    if (err) {
      console.error("회원 추가 중 오류 발생:", err.message);
    } else {
      console.log("회원이 성공적으로 추가되었습니다.");
    }
  });
}

function viewMembers() {
  console.log("\n=== 회원 목록 ===");
  connection.query("SELECT * FROM Member", (err, rows) => {
    if (err) {
      console.error("회원 조회 중 오류 발생:", err.message);
    } else if (rows.length === 0) {
      console.log("등록된 회원이 없습니다.");
    } else {
      rows.forEach((row) => {
        console.log(`
ID: ${row.MemberID}
이름: ${row.MemberName}
이메일: ${row.Email}
연락처: ${row.Contact}
가입일: ${row.JoinDate}
직책: ${row.Position}
상태: ${row.MemberStatus}
------------------------`);
      });
    }
  });
}

function updateMember() {
  console.log("\n=== 회원 정보 수정 ===");
  const memberId = readline.questionInt("수정할 회원의 ID를 입력하세요: ");
  
  connection.query("SELECT * FROM Member WHERE MemberID = ?", [memberId], (err, rows) => {
    if (err || rows.length === 0) {
      console.log("해당 회원을 찾을 수 없습니다.");
      return;
    }

    console.log("수정할 정보를 입력하세요 (변경하지 않을 항목은 엔터를 누르세요):");
    const name = readline.question(`회원 이름 (${rows[0].MemberName}): `) || rows[0].MemberName;
    const email = readline.question(`이메일 (${rows[0].Email}): `) || rows[0].Email;
    const contact = readline.question(`연락처 (${rows[0].Contact}): `) || rows[0].Contact;
    const position = readline.question(`직책 (${rows[0].Position}): `) || rows[0].Position;
    const status = readline.question(`상태 (${rows[0].MemberStatus}): `) || rows[0].MemberStatus;

    const query = `
      UPDATE Member 
      SET MemberName = ?, Email = ?, Contact = ?, Position = ?, MemberStatus = ?
      WHERE MemberID = ?
    `;

    connection.query(query, [name, email, contact, position, status, memberId], (err) => {
      if (err) {
        console.error("회원 정보 수정 중 오류 발생:", err.message);
      } else {
        console.log("회원 정보가 성공적으로 수정되었습니다.");
      }
    });
  });
}

function deleteMember() {
  console.log("\n=== 회원 삭제 ===");
  const memberId = readline.questionInt("삭제할 회원의 ID를 입력하세요: ");

  const query = "DELETE FROM Member WHERE MemberID = ?";
  connection.query(query, [memberId], (err, result) => {
    if (err) {
      console.error("회원 삭제 중 오류 발생:", err.message);
    } else if (result.affectedRows === 0) {
      console.log("해당 회원을 찾을 수 없습니다.");
    } else {
      console.log("회원이 성공적으로 삭제되었습니다.");
    }
  });
}

// 동아리 관련 함수들
function viewClubs() {
  console.log("\n=== 동아리 목록 ===");
  const query = `
    SELECT c.*, cs.MemberCount, cs.Budget 
    FROM Club c 
    LEFT JOIN ClubStatistics cs ON c.ClubID = cs.ClubID
  `;
  
  connection.query(query, (err, rows) => {
    if (err) {
      console.error("동아리 조회 중 오류 발생:", err.message);
    } else if (rows.length === 0) {
      console.log("등록된 동아리가 없습니다.");
    } else {
      rows.forEach((row) => {
        console.log(`
동아리 ID: ${row.ClubID}
이름: ${row.ClubName}
지도교수: ${row.Advisor}
소개: ${row.ClubIntroduction}
주요활동: ${row.MainActivities}
상태: ${row.ClubStatus}
회원수: ${row.MemberCount}
예산: ${row.Budget}원
------------------------`);
      });
    }
  });
}

function searchMembers() {
  console.log("\n=== 회원 검색 ===");
  const searchTerm = readline.question("검색할 회원 이름을 입력하세요: ");

  const query = `
    SELECT * FROM Member 
    WHERE MemberName LIKE ? OR Email LIKE ?
  `;
  
  connection.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, rows) => {
    if (err) {
      console.error("회원 검색 중 오류 발생:", err.message);
    } else if (rows.length === 0) {
      console.log("검색 결과가 없습니다.");
    } else {
      console.log(`${rows.length}명의 회원이 검색되었습니다:`);
      rows.forEach((row) => {
        console.log(`
ID: ${row.MemberID}
이름: ${row.MemberName}
이메일: ${row.Email}
상태: ${row.MemberStatus}
------------------------`);
      });
    }
  });
}

function mainMenu() {
  console.log("데이터베이스 초기화 중...");
  require("./createDatabase")(() => {
    while (true) {
      console.log("\n=== 동아리 관리 시스템 ===");
      console.log("1. 회원 추가");
      console.log("2. 회원 목록 조회");
      console.log("3. 회원 정보 수정");
      console.log("4. 회원 삭제");
      console.log("5. 회원 검색");
      console.log("6. 동아리 목록 조회");
      console.log("7. 종료");

      const choice = readline.questionInt("원하시는 메뉴를 선택하세요: ");
      
      switch (choice) {
        case 1:
          addMember();
          break;
        case 2:
          viewMembers();
          break;
        case 3:
          updateMember();
          break;
        case 4:
          deleteMember();
          break;
        case 5:
          searchMembers();
          break;
        case 6:
          viewClubs();
          break;
        case 7:
          console.log("프로그램을 종료합니다.");
          connection.end();
          return;
        default:
          console.log("잘못된 선택입니다. 다시 시도해주세요.");
      }
    }
  });
}

mainMenu();
