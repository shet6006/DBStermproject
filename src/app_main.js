const connection = require("./db_connect");
const { adminMenu } = require("./app_menus");

let isAdmin = false;

const prompt = async (question) => {
  return new Promise((resolve) => {
    process.stdout.write(`${question}`);
    process.stdin.once("data", (data) => resolve(data.toString().trim()));
  });
};

// 관리자 인증
const adminLogin = async () => {
  const password = await prompt("관리자 비밀번호를 입력하세요: ");
  if (password === "****") {
    console.log("관리자 권한이 활성화되었습니다.");
    isAdmin = true;
  } else {
    console.log("비밀번호가 올바르지 않습니다.");
  }
};

// 동아리 보기
const viewClubs = async () => {
  return new Promise((resolve) => {
    const query = "SELECT * FROM Club";
    connection.query(query, (err, rows) => {
      if (err) {
        console.error("동아리 정보를 가져오는 중 오류 발생:", err.message);
      } else if (rows.length === 0) {
        console.log("등록된 동아리가 없습니다.");
      } else {
        console.log("\n=== 동아리 목록 ===");
        rows.forEach((row) => {
          console.log(
            `동아리 ID: ${row.ClubID}, 동아리 이름: ${row.ClubName}, 지도 교수: ${row.Advisor}, 동아리 소개: ${row.ClubIntroduction}`
          );
        });
      }
      resolve();
    });
  });
};

// 메인 메뉴
const mainMenu = async () => {
  console.log("데이터베이스 초기화 중...");
  await new Promise((resolve) => require("./createDatabase")(resolve));

  while (true) {
    console.log("\n=== 동아리 관리 시스템 ===");
    console.log("1. 동아리 보기");
    console.log("2. 관리자 로그인");
    console.log("3. 종료");

    const choice = await prompt("메뉴를 선택하세요: ");
    switch (choice) {
      case "1":
        await viewClubs();
        break;
      case "2":
        await adminLogin();
        if (isAdmin) await adminMenu();
        break;
      case "3":
        console.log("프로그램을 종료합니다.");
        connection.end();
        process.exit(0);
        break;
      default:
        console.log("잘못된 선택입니다. 다시 시도하세요.");
    }
  }
};

mainMenu();
