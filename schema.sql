-- Member Table
CREATE TABLE IF NOT EXISTS Member (
    MemberID INT PRIMARY KEY,
    MemberName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Contact VARCHAR(15),
    JoinDate DATE NOT NULL,
    Position VARCHAR(50),
    MemberStatus VARCHAR(50) NOT NULL
);

-- Club Table
CREATE TABLE IF NOT EXISTS Club (
    ClubID INT PRIMARY KEY,
    ClubName VARCHAR(100) NOT NULL UNIQUE,
    Advisor VARCHAR(100),
    ClubIntroduction TEXT,
    MainActivities TEXT,
    ClubStatus VARCHAR(50) NOT NULL
);

-- Club Statistics Table
CREATE TABLE IF NOT EXISTS ClubStatistics (
    ClubID INT PRIMARY KEY,
    ActivityDetails TEXT,
    Budget DECIMAL(15, 2),
    MemberCount INT,
    ClubStatus VARCHAR(50) NOT NULL,
    FOREIGN KEY (ClubID) REFERENCES Club(ClubID) ON DELETE CASCADE
);

-- Manager Table
CREATE TABLE IF NOT EXISTS Manager (
    ManagerID INT PRIMARY KEY,
    ManagerName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Contact VARCHAR(15)
);

-- Activity Table
CREATE TABLE IF NOT EXISTS Activity (
    ActivityID INT PRIMARY KEY,
    ActivityName VARCHAR(100) NOT NULL,
    ActivityDescription TEXT
);

-- Belong Table
CREATE TABLE IF NOT EXISTS Belong (
    MemberID INT,
    ClubID INT,
    PRIMARY KEY (MemberID, ClubID),
    FOREIGN KEY (MemberID) REFERENCES Member(MemberID) ON DELETE CASCADE,
    FOREIGN KEY (ClubID) REFERENCES Club(ClubID) ON DELETE CASCADE
);

-- Participate Table
CREATE TABLE IF NOT EXISTS Participate (
    MemberID INT,
    ActivityID INT,
    PRIMARY KEY (MemberID, ActivityID),
    FOREIGN KEY (MemberID) REFERENCES Member(MemberID) ON DELETE CASCADE,
    FOREIGN KEY (ActivityID) REFERENCES Activity(ActivityID) ON DELETE CASCADE
);
