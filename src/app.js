const initializeDatabase = require('./createDatabase'); // createDatabase.js
const readline = require('readline');
const connection = require('./db_connect'); // db_connect.js

// CLI 인터페이스 생성
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 메인 메뉴
function mainMenu() {
  console.log(`
==============================
  데이터베이스 관리 시스템
==============================
1. 회원 생성
2. 동아리 생성
3. 데이터 조회
4. 데이터 수정
5. 데이터 삭제
6. 종료
==============================
  원하는 작업 번호를 입력하세요:
  `);

  rl.question('> ', (answer) => {
    switch (answer.trim()) {
      case '1':
        createMember();
        break;
      case '2':
        createClub();
        break;
      case '3':
        viewData();
        break;
      case '4':
        updateData();
        break;
      case '5':
        deleteData();
        break;
      case '6':
        console.log('프로그램을 종료합니다.');
        connection.end(); // 프로그램 종료 시 연결 종료
        rl.close();
        process.exit();
        break;
      default:
        console.log('잘못된 입력입니다. 다시 선택해주세요.');
        mainMenu();
    }
  });
}

// 회원 생성 (예제 함수)
function createMember() {
  rl.question('회원 이름: ', (name) => {
    // ...
    mainMenu(); // 작업 완료 후 메인 메뉴로 돌아가기
  });
}

// 프로그램 시작
initializeDatabase(() => {
  console.log('데이터베이스 초기화 완료!');
  mainMenu(); // 초기화 완료 후 메인 메뉴 실행
});
