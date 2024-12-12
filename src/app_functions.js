const connection = require("./db_connect");

const prompt = async (question) => {
  return new Promise((resolve) => {
    process.stdout.write(`${question}`);
    process.stdin.once("data", (data) => resolve(data.toString().trim()));
  });
};

// 회원 관리
const memberMenu = async () => {
  while (true) {
    console.log("\n=== 회원 관리 ===");
    console.log("1. 회원 등록");
    console.log("2. 회원 삭제");
    console.log("3. 회원 정보 변경");
    console.log("4. 동아리 이동");
    console.log("5. 메인 메뉴로 돌아가기");

    const choice = await prompt("작업을 선택하세요: ");
    switch (choice) {
      case "1":
        await registerMember();
        break;
      case "2":
        await deleteMember();
        break;
      case "3":
        await updateMember();
        break;
      case "4":
        await moveMember();
        break;
      case "5":
        return;
      default:
        console.log("잘못된 선택입니다. 다시 시도하세요.");
    }
  }
};

// 동아리 관리
const clubMenu = async () => {
  while (true) {
    console.log("\n=== 동아리 관리 ===");
    console.log("1. 동아리 등록");
    console.log("2. 동아리 삭제");
    console.log("3. 동아리별 관리");
    console.log("4. 메인 메뉴로 돌아가기");

    const choice = await prompt("작업을 선택하세요: ");
    switch (choice) {
      case "1":
        await registerClub();
        break;
      case "2":
        await deleteClub();
        break;
      case "3":
        const clubId = await prompt("관리할 동아리 ID를 입력하세요: ");
        await manageClubById(clubId);
        break;
      case "4":
        return;
      default:
        console.log("잘못된 선택입니다. 다시 시도하세요.");
    }
  }
};

// 활동 관리
const activityMenu = async () => {
  while (true) {
    console.log("\n=== 활동 관리 ===");
    console.log("1. 활동 등록");
    console.log("2. 활동 삭제");
    console.log("3. 활동 보기");
    console.log("4. 참여 학생 등록");
    console.log("5. 참여 학생 삭제");
    console.log("6. 메인 메뉴로 돌아가기");

    const choice = await prompt("작업을 선택하세요: ");
    switch (choice) {
      case "1":
        await registerActivity();
        break;
      case "2":
        await deleteActivity();
        break;
      case "3":
        const clubId = await prompt("활동을 조회할 동아리 ID를 입력하세요: ");
        const activityId = await viewClubActivities(clubId);
        if (activityId) {
          await viewActivityParticipants(activityId);
        }
        break;
      case "4":
        await registerActivityParticipant();
        break;
      case "5":
        await deleteActivityParticipant();
        break;
      case "6":
        return;
      default:
        console.log("잘못된 선택입니다. 다시 시도하세요.");
    }
  }
};

const updateClubInfo = async (clubId) => {
  const query = "SELECT * FROM Club WHERE ClubID = ?";
  connection.query(query, [clubId], async (err, rows) => {
    if (err || rows.length === 0) {
      console.log("동아리 정보를 찾을 수 없습니다.");
      return;
    }

    const club = rows[0];
    console.log(`현재 동아리 이름: ${club.ClubName}`);
    const name = (await prompt("새로운 동아리 이름: ")) || club.ClubName;

    console.log(`현재 지도 교수: ${club.Advisor}`);
    const advisor = (await prompt("새로운 지도 교수: ")) || club.Advisor;

    console.log(`현재 동아리 소개: ${club.ClubIntroduction}`);
    const introduction =
      (await prompt("새로운 동아리 소개: ")) || club.ClubIntroduction;

    const updateQuery = `UPDATE Club SET ClubName = ?, Advisor = ?, ClubIntroduction = ? WHERE ClubID = ?`;
    connection.query(
      updateQuery,
      [name, advisor, introduction, clubId],
      (err) => {
        if (err) {
          console.error(
            "동아리 정보 수정 중 오류가 발생했습니다:",
            err.message
          );
        } else {
          console.log("동아리 정보가 성공적으로 수정되었습니다.");
        }
      }
    );
  });
};

// 동아리 통계 보기
const viewClubStatistics = async (clubId) => {
  const query = "SELECT * FROM ClubStatistics WHERE ClubID = ?";
  connection.query(query, [clubId], (err, rows) => {
    if (err) {
      console.error("동아리 통계 정보를 가져오는 중 오류 발생:", err.message);
    } else if (rows.length === 0) {
      console.log("해당 동아리의 통계 정보가 없습니다.");
    } else {
      console.log("\n=== 동아리 통계 ===");
      rows.forEach((row) => {
        console.log(
          `예산: ${row.Budget}, 회원 수: ${row.MemberCount}, 상태: ${row.ClubStatus}`
        );
      });
    }
  });
};

// 동아리 회원 보기
const viewClubMembers = async (clubId) => {
  const query = `
    SELECT m.MemberID, m.MemberName, m.Email, m.Position
    FROM Member m
    JOIN Belong b ON m.MemberID = b.MemberID
    WHERE b.ClubID = ?`;
  connection.query(query, [clubId], (err, rows) => {
    if (err) {
      console.error("회원 정보를 가져오는 중 오류 발생:", err.message);
    } else if (rows.length === 0) {
      console.log("해당 동아리에 등록된 회원이 없습니다.");
    } else {
      console.log("\n=== 동아리 회원 ===");
      rows.forEach((row) => {
        const joinDate = new Date(row.JoinDate).toISOString().split("T")[0];
        console.log(
          `회원 ID: ${row.MemberID}, 이름: ${row.MemberName}, 이메일: ${row.Email}, 연락처: ${row.Contact}, 가입 날짜: ${joinDate}, 직책: ${row.Position}`
        );
      });
    }
  });
};

const viewClubActivities = async (clubId) => {
  const query = `
    SELECT a.ActivityID, a.ActivityName
    FROM Activity a
    WHERE a.ClubID = ?
  `;
  connection.query(query, [clubId], async (err, rows) => {
    if (err || rows.length === 0) {
      console.log("해당 동아리에서 진행한 활동이 없습니다.");
      return;
    }

    console.log("\n=== 동아리 활동 ===");
    rows.forEach((row) => {
      console.log(`활동 ID: ${row.ActivityID}, 이름: ${row.ActivityName}`);
    });

    const activityId = await prompt(
      "학생 정보를 조회할 활동 ID를 입력하세요: "
    );
    viewActivityParticipants(activityId);
  });
};

const viewActivityParticipants = async (activityId) => {
  const query = `
    SELECT m.MemberID, m.MemberName
    FROM Member m
    JOIN Participate p ON m.MemberID = p.MemberID
    WHERE p.ActivityID = ?
  `;
  connection.query(query, [activityId], (err, rows) => {
    if (err || rows.length === 0) {
      console.log("해당 활동에 참여한 학생이 없습니다.");
      return;
    }

    console.log("\n=== 활동 참여 학생 ===");
    rows.forEach((row) => {
      console.log(`학생 ID: ${row.MemberID}, 이름: ${row.MemberName}`);
    });
  });
};

// 회원 등록
const registerMember = async () => {
  const name = await prompt("회원 이름을 입력하세요: ");
  const email = await prompt("회원 이메일을 입력하세요: ");
  const contact = await prompt("회원 연락처를 입력하세요: ");
  const joinDate = await prompt("가입일 (YYYY-MM-DD)을 입력하세요: ");
  const position = await prompt("회원 직책을 입력하세요: ");
  const status = await prompt("회원 상태 (활동중/비활동중)를 입력하세요: ");
  const clubId = await prompt("회원이 소속될 동아리 ID를 입력하세요: ");

  const memberQuery = `INSERT INTO Member (MemberName, Email, Contact, JoinDate, Position, MemberStatus) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(
    memberQuery,
    [name, email, contact, joinDate, position, status],
    (err, result) => {
      if (err) {
        console.error("회원 등록 중 오류가 발생했습니다:", err.message);
      } else {
        console.log("회원이 성공적으로 등록되었습니다.");
        const memberId = result.insertId; // 방금 등록된 회원의 ID를 가져옴

        // 회원을 Belong 테이블에 등록
        const belongQuery = `INSERT INTO Belong (MemberID, ClubID) VALUES (?, ?)`;
        connection.query(belongQuery, [memberId, clubId], (err) => {
          if (err) {
            console.error(
              "동아리 소속 등록 중 오류가 발생했습니다:",
              err.message
            );
          } else {
            console.log("회원이 동아리에 성공적으로 등록되었습니다.");
          }
        });
      }
    }
  );
};

// 회원 삭제
const deleteMember = async () => {
  const memberId = await prompt("삭제할 회원 ID를 입력하세요: ");

  const query = "DELETE FROM Member WHERE MemberID = ?";
  connection.query(query, [memberId], (err, result) => {
    if (err) {
      console.error("회원 삭제 중 오류가 발생했습니다:", err.message);
    } else if (result.affectedRows === 0) {
      console.log("해당 회원을 찾을 수 없습니다.");
    } else {
      console.log("회원이 성공적으로 삭제되었습니다.");
    }
  });
};

// 회원 정보 변경
const updateMember = async () => {
  const memberId = await prompt("수정할 회원 ID를 입력하세요: ");

  const query = "SELECT * FROM Member WHERE MemberID = ?";
  connection.query(query, [memberId], async (err, rows) => {
    if (err || rows.length === 0) {
      console.log("회원 정보를 찾을 수 없습니다.");
      return;
    }

    const member = rows[0];
    const name =
      (await prompt(`회원 이름 (${member.MemberName}): `)) || member.MemberName;
    const email = (await prompt(`이메일 (${member.Email}): `)) || member.Email;
    const contact =
      (await prompt(`연락처 (${member.Contact}): `)) || member.Contact;
    const position =
      (await prompt(`직책 (${member.Position}): `)) || member.Position;
    const status =
      (await prompt(`회원 상태 (${member.MemberStatus}): `)) ||
      member.MemberStatus;

    const updateQuery = `UPDATE Member SET MemberName = ?, Email = ?, Contact = ?, Position = ?, MemberStatus = ? WHERE MemberID = ?`;
    connection.query(
      updateQuery,
      [name, email, contact, position, status, memberId],
      (err) => {
        if (err) {
          console.error("회원 정보 수정 중 오류가 발생했습니다:", err.message);
        } else {
          console.log("회원 정보가 성공적으로 수정되었습니다.");
        }
      }
    );
  });
};

// 회원 동아리 이동
const moveMember = async () => {
  const memberId = await prompt("이동할 회원 ID를 입력하세요: ");
  const clubId = await prompt("이동할 동아리 ID를 입력하세요: ");

  const query = `REPLACE INTO Belong (MemberID, ClubID) VALUES (?, ?)`;
  connection.query(query, [memberId, clubId], (err) => {
    if (err) {
      console.error("회원 이동 중 오류가 발생했습니다:", err.message);
    } else {
      console.log("회원이 성공적으로 이동되었습니다.");
    }
  });
};

// 동아리 등록
const registerClub = async () => {
  const name = await prompt("동아리 이름을 입력하세요: ");
  const advisor = await prompt("지도 교수명을 입력하세요: ");
  const introduction = await prompt("동아리 소개를 입력하세요: ");

  const query = `INSERT INTO Club (ClubName, Advisor, ClubIntroduction) VALUES (?, ?, ?)`;
  connection.query(query, [name, advisor, introduction], (err) => {
    if (err) {
      console.error("동아리 등록 중 오류가 발생했습니다:", err.message);
    } else {
      console.log("동아리가 성공적으로 등록되었습니다.");
    }
  });
};

// 동아리 삭제
const deleteClub = async () => {
  const clubId = await prompt("삭제할 동아리 ID를 입력하세요: ");

  const query = "DELETE FROM Club WHERE ClubID = ?";
  connection.query(query, [clubId], (err, result) => {
    if (err) {
      console.error("동아리 삭제 중 오류가 발생했습니다:", err.message);
    } else if (result.affectedRows === 0) {
      console.log("해당 동아리를 찾을 수 없습니다.");
    } else {
      console.log("동아리가 성공적으로 삭제되었습니다.");
    }
  });
};

// 동아리별 관리
const manageClubById = async (clubId) => {
  while (true) {
    console.log("\n=== 동아리별 관리 ===");
    console.log("1. 동아리 정보 관리");
    console.log("2. 동아리 통계 보기");
    console.log("3. 동아리 회원 보기");
    console.log("4. 메인 메뉴로 돌아가기");

    const choice = await prompt("작업을 선택하세요: ");
    switch (choice) {
      case "1":
        await updateClubInfo(clubId);
        break;
      case "2":
        await viewClubStatistics(clubId);
        break;
      case "3":
        await viewClubMembers(clubId);
        break;
      case "4":
        return;
      default:
        console.log("잘못된 선택입니다. 다시 시도하세요.");
    }
  }
};

// 활동 등록
const registerActivity = async () => {
  const name = await prompt("활동 이름을 입력하세요: ");
  const description = await prompt("활동 설명을 입력하세요: ");
  const clubId = await prompt("활동을 등록할 동아리 ID를 입력하세요: ");

  const query = `INSERT INTO Activity (ActivityName, ActivityDescription, ClubID) VALUES (?, ?, ?)`;
  connection.query(query, [name, description, clubId], (err) => {
    if (err) {
      console.error("활동 등록 중 오류가 발생했습니다:", err.message);
    } else {
      console.log("활동이 성공적으로 등록되었습니다.");
    }
  });
};

// 활동 삭제
const deleteActivity = async () => {
  const activityId = await prompt("삭제할 활동 ID를 입력하세요: ");

  const query = "DELETE FROM Activity WHERE ActivityID = ?";
  connection.query(query, [activityId], (err, result) => {
    if (err) {
      console.error("활동 삭제 중 오류가 발생했습니다:", err.message);
    } else if (result.affectedRows === 0) {
      console.log("해당 활동을 찾을 수 없습니다.");
    } else {
      console.log("활동이 성공적으로 삭제되었습니다.");
    }
  });
};

// 참여 학생 등록
const registerActivityParticipant = async () => {
  const activityId = await prompt("학생을 등록할 활동 ID를 입력하세요: ");
  const memberId = await prompt("등록할 회원 ID를 입력하세요: ");

  const query = `INSERT INTO Participate (ActivityID, MemberID) VALUES (?, ?)`;
  connection.query(query, [activityId, memberId], (err) => {
    if (err) {
      console.error("참여 학생 등록 중 오류가 발생했습니다:", err.message);
    } else {
      console.log("학생이 성공적으로 활동에 등록되었습니다.");
    }
  });
};

// 참여 학생 삭제
const deleteActivityParticipant = async () => {
  const activityId = await prompt("학생을 삭제할 ID를 입력하세요: ");
  const memberId = await prompt("삭제할 회원 ID를 입력하세요: ");

  const query = `DELETE FROM Participate WHERE ActivityID = ? AND MemberID = ?`;
  connection.query(query, [activityId, memberId], (err, result) => {
    if (err) {
      console.error("참여 학생 삭제 중 오류가 발생했습니다:", err.message);
    } else if (result.affectedRows === 0) {
      console.log("해당 활동에 등록된 학생을 찾을 수 없습니다.");
    } else {
      console.log("학생이 성공적으로 활동에서 삭제되었습니다.");
    }
  });
};

module.exports = {
  memberMenu,
  clubMenu,
  activityMenu,
  registerMember,
  deleteMember,
  updateMember,
  moveMember,
  registerClub,
  deleteClub,
  manageClubById,
  registerActivity,
  deleteActivity,
  registerActivityParticipant,
  deleteActivityParticipant,
  viewClubStatistics,
  viewClubMembers,
  viewClubActivities,
  viewActivityParticipants,
};
