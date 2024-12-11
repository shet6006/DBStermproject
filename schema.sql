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

-- Insert Dummy Data for Member
INSERT INTO Member (MemberID, MemberName, Email, Contact, JoinDate, Position, MemberStatus) VALUES
(1, '김철수', 'chulsoo@example.com', '010-1234-5678', '2024-01-01', '회장', '활동중'),
(2, '이영희', 'younghee@example.com', '010-2345-6789', '2024-02-01', '회장', '활동중'),
(3, '박민수', 'minsoo@example.com', '010-3456-7890', '2024-03-01', '회장', '활동중'),
(4, '최수진', 'soojin@example.com', '010-4567-8901', '2024-04-01', '회장', '활동중'),
(5, '정다은', 'daeun@example.com', '010-5678-9012', '2024-05-01', '회장', '활동중'),
(6, '한지민', 'jimin@example.com', '010-6789-0123', '2024-06-01', '회장', '활동중'),
(7, '김하늘', 'haneul@example.com', '010-7890-1234', '2024-07-01', '회장', '활동중'),
(8, '홍길동', 'gildong@example.com', '010-8901-2345', '2024-08-01', '회원', '활동중'),
(9, '강수현', 'suhyun@example.com', '010-9012-3456', '2024-09-01', '회원', '활동중'),
(10, '이준혁', 'junhyuk@example.com', '010-0123-4567', '2024-10-01', '회원', '활동중'),
(11, '김창섭', 'changsub@example.com', '010-0234-4567', '2024-08-03', '회원', '활동중'),
(12, '박찬호', 'chanho@example.com', '010-0345-4567', '2024-11-03', '회원', '비활동중'),
(13, '김동원', 'dongwon@example.com', '010-0556-4567', '2024-01-03', '회원', '활동중');

-- Insert Dummy Data for Club
INSERT INTO Club (ClubID, ClubName, Advisor, ClubIntroduction, MainActivities, ClubStatus) VALUES
(1, '큐빅', '김철수', '혁신적인 기술을 탐구하는 동아리입니다.', '해커톤', 'Active'),
(2, '샘마루', '이영희', '문학과 예술을 사랑하는 동아리입니다.', '책 리뷰', 'Active'),
(3, '턱스', '박민수', '스포츠를 즐기고 건강을 추구하는 동아리입니다.', '대회 개최', 'Inactive'),
(4, '엠시스', '최수진', '컴퓨터 과학을 연구하는 동아리입니다.', '코딩 워크샵', 'Active'),
(5, '노바', '정다은', '연극과 연기를 연습하는 동아리입니다.', '무대 공연', 'Inactive'),
(6, '네스트넷', '한지민', '로봇 공학과 네트워크를 연구합니다.', '로봇 대회', 'Active'),
(7, '피디에이', '김하늘', '개인 개발 프로젝트를 진행합니다.', '프로젝트 발표', 'Active');

-- Insert Dummy Data for ClubStatistics
INSERT INTO ClubStatistics (ClubID, ActivityDetails, Budget, MemberCount, ClubStatus) VALUES
(1, 'Hackathon', 5000.00, 20, 'Active'),
(2, 'Art Exhibitions', 3000.00, 15, 'Active'),
(3, 'Sports Tournament', 2000.00, 10, 'Inactive'),
(4, 'Workshops', 6000.00, 12, 'Active'),
(5, 'Stage Performances', 2500.00, 8, 'Inactive'),
(6, 'Robot Competitions', 7000.00, 18, 'Active'),
(7, 'Project Announcements', 3000.00, 10, 'Active');

-- Insert Dummy Data for Manager
INSERT INTO Manager (ManagerID, ManagerName, Email, Contact) VALUES
(1, '관리자', 'manager@example.com', '010-1111-2222');
