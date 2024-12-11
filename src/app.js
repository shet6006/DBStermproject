const readline = require("readline-sync");
const connection = require("./db_connect");

function addMember() {
  const name = readline.question("Member Name: ");
  const email = readline.question("Email: ");
  const contact = readline.question("Contact: ");
  const joinDate = readline.question("Join Date (YYYY-MM-DD): ");
  const position = readline.question("Position: ");
  const status = readline.question("Member Status: ");

  const query = `
    INSERT INTO Member (MemberName, Email, Contact, JoinDate, Position, MemberStatus)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  connection.query(query, [name, email, contact, joinDate, position, status], (err) => {
    if (err) {
      console.error("Error while adding member:", err.message);
    } else {
      console.log("Member has been successfully added.");
    }
  });
}

function viewMembers() {
  connection.query("SELECT * FROM Member", (err, rows) => {
    if (err) {
      console.error("Error while retrieving members:", err.message);
    } else if (rows.length === 0) {
      console.log("No members found.");
    } else {
      rows.forEach((row) => {
        console.log(`MemberID: ${row.MemberID}, Name: ${row.MemberName}, Email: ${row.Email}`);
      });
    }
  });
}

function mainMenu() {
  console.log("Initializing database...");
  require("./createDatabase")(() => {
    while (true) {
      console.log("\nClub Management System");
      console.log("1. Add Member");
      console.log("2. View Members");
      console.log("3. Exit");

      const choice = readline.questionInt("Choose an option: ");
      switch (choice) {
        case 1:
          addMember();
          break;
        case 2:
          viewMembers();
          break;
        case 3:
          console.log("Exiting the system.");
          connection.end();
          return;
        default:
          console.log("Invalid choice. Please try again.");
      }
    }
  });
}

mainMenu();
