const { memberMenu, clubMenu, activityMenu } = require("./app_functions");

const prompt = async (question) => {
  return new Promise((resolve) => {
    process.stdout.write(`${question}`);
    process.stdin.once("data", (data) => resolve(data.toString().trim()));
  });
};

const adminMenu = async () => {
  while (true) {
    console.log("\n=== 관리자 메뉴 ===");
    console.log("1. 회원 관리");
    console.log("2. 동아리 관리");
    console.log("3. 활동 관리");
    console.log("4. 메인 메뉴로 돌아가기");

    const choice = await prompt("작업을 선택하세요: ");
    switch (choice) {
      case "1":
        await memberMenu();
        break;
      case "2":
        await clubMenu();
        break;
      case "3":
        await activityMenu();
        break;
      case "4":
        return;
      default:
        console.log("잘못된 선택입니다. 다시 시도하세요.");
    }
  }
};

module.exports = { adminMenu };
