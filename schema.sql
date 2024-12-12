CREATE TABLE IF NOT EXISTS Member (
    MemberID INT AUTO_INCREMENT PRIMARY KEY,
    MemberName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Contact VARCHAR(15),
    JoinDate DATE NOT NULL,
    Position VARCHAR(50),
    MemberStatus VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Club (
    ClubID INT AUTO_INCREMENT PRIMARY KEY,
    ClubName VARCHAR(100) NOT NULL UNIQUE,
    Advisor VARCHAR(100),
    ClubIntroduction TEXT,
    MainActivities TEXT
);

CREATE TABLE IF NOT EXISTS ClubStatistics (
    ClubID INT PRIMARY KEY,
    Budget DECIMAL(15, 2),
    MemberCount INT DEFAULT 0,
    ClubStatus VARCHAR(50) NOT NULL,
    FOREIGN KEY (ClubID) REFERENCES Club(ClubID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Manager (
    ManagerID INT AUTO_INCREMENT PRIMARY KEY,
    ManagerName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Contact VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS Activity (
    ActivityID INT AUTO_INCREMENT PRIMARY KEY,
    ActivityName VARCHAR(100) NOT NULL,
    ActivityDescription TEXT,
    ClubID INT,
    FOREIGN KEY (ClubID) REFERENCES Club(ClubID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Belong (
    MemberID INT,
    ClubID INT,
    PRIMARY KEY (MemberID, ClubID),
    FOREIGN KEY (MemberID) REFERENCES Member(MemberID) ON DELETE CASCADE,
    FOREIGN KEY (ClubID) REFERENCES Club(ClubID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Participate (
    MemberID INT,
    ActivityID INT,
    PRIMARY KEY (MemberID, ActivityID),
    FOREIGN KEY (MemberID) REFERENCES Member(MemberID) ON DELETE CASCADE,
    FOREIGN KEY (ActivityID) REFERENCES Activity(ActivityID) ON DELETE CASCADE
);

INSERT INTO Member (MemberName, Email, Contact, JoinDate, Position, MemberStatus) VALUES
('김철수', 'chulsoo@cubic.com', '010-1234-5678', '2024-01-01', '회장', '활동중'), 
('이영희', 'younghee@cubic.com', '010-2345-6789', '2024-01-05', '부회장', '활동중'), 
('박민수', 'minsoo@cubic.com', '010-3456-7890', '2024-01-10', '회원', '활동중'),
('최수진', 'soojin@cubic.com', '010-4567-8901', '2024-01-15', '회원', '활동중'),

('정다은', 'daeun@sammaru.com', '010-5678-9012', '2024-01-01', '회장', '활동중'),
('한지민', 'jimin@sammaru.com', '010-6789-0123', '2024-01-05', '부회장', '활동중'),
('김하늘', 'haneul@sammaru.com', '010-7890-1234', '2024-01-10', '회원', '활동중'),
('홍길동', 'gildong@sammaru.com', '010-8901-2345', '2024-01-15', '회원', '활동중'),

('강수현', 'suhyun@nestnet.com', '010-9012-3456', '2024-01-01', '회장', '활동중'),
('이준혁', 'junhyuk@nestnet.com', '010-0123-4567', '2024-01-05', '부회장', '활동중'),
('김창섭', 'changsub@nestnet.com', '010-0234-4567', '2024-01-10', '회원', '활동중'),
('박찬호', 'chanho@nestnet.com', '010-0345-4567', '2024-01-15', '회원', '활동중'),

('조민아', 'minah@nova.com', '010-0556-7890', '2024-01-01', '회장', '활동중'),
('장수영', 'sooyoung@nova.com', '010-0667-8901', '2024-01-05', '부회장', '활동중'),
('이동훈', 'donghoon@nova.com', '010-0778-9012', '2024-01-10', '회원', '활동중'),
('최진수', 'jinsu@nova.com', '010-0889-0123', '2024-01-15', '회원', '활동중'),

('김영철', 'youngchul@tux.com', '010-0990-1234', '2024-01-01', '회장', '활동중'),
('윤선영', 'sunyoung@tux.com', '010-0110-2345', '2024-01-05', '부회장', '활동중'),
('김준호', 'junho@tux.com', '010-0221-3456', '2024-01-10', '회원', '활동중'),
('박혜린', 'hyerin@tux.com', '010-0332-4567', '2024-01-15', '회원', '활동중'),

('최태현', 'taehyun@pda.com', '010-0443-5678', '2024-01-01', '회장', '활동중'), 
('송다영', 'dayoung@pda.com', '010-0554-6789', '2024-01-05', '부회장', '활동중'),
('김성진', 'sungjin@pda.com', '010-0665-7890', '2024-01-10', '회원', '활동중'),
('이정민', 'jungmin@pda.com', '010-0776-8901', '2024-01-15', '회원', '활동중'),

('윤지혁', 'jihyuk@msys.com', '010-0887-9012', '2024-01-01', '회장', '활동중'), 
('김소영', 'soyoung@msys.com', '010-0998-0123', '2024-01-05', '부회장', '활동중'),
('박진우', 'jinwoo@msys.com', '010-0111-1234', '2024-01-10', '회원', '활동중'),
('송지민', 'jimin@msys.com', '010-0222-2345', '2024-01-15', '회원', '활동중'); 
-- Club 데이터
INSERT INTO Club (ClubName, Advisor, ClubIntroduction, MainActivities) VALUES
('큐빅', '이재성', '큐빅입니다.', '연구'),
('샘마루', '아지즈', '샘마루입니다.', '연구'),
('네스트넷', '이건명', '네스트넷입니다.', '연구'),
('노바', '최경주', '노바입니다.', '연구'),
('턱스', '노서영', '턱스입니다.', '연구'),
('피디에이', '홍장의', '피디에이입니다.', '연구'),
('엠시스', '조오현', '엠시스입니다.', '연구');

-- Belong 데이터
INSERT INTO Belong (MemberID, ClubID) VALUES
(1, 1), (2, 1), (3, 1), (4, 1),
(5, 2), (6, 2), (7, 2), (8, 2),
(9, 3), (10, 3), (11, 3), (12, 3),
(13, 4), (14, 4), (15, 4), (16, 4),
(17, 5), (18, 5), (19, 5), (20, 5),
(21, 6), (22, 6), (23, 6), (24, 6),
(25, 7), (26, 7), (27, 7), (28, 7);

-- Activity 데이터
INSERT INTO Activity (ActivityName, ActivityDescription, ClubID) VALUES
('정기 회의', '동아리 정기 회의 진행', 1),
('신입생 환영회', '신입 회원 환영 및 소개', 2),
('프로젝트 발표회', '개발 프로젝트 발표', 3),
('스터디 모임', '기술 스터디 진행', 4),
('워크숍', '외부 전문가 초청 워크숍', 5),
('해커톤', '24시간 해커톤 개최', 6),
('MT', '동아리 전체 MT 행사', 7);

-- Participate 데이터
INSERT INTO Participate (MemberID, ActivityID) VALUES
(1, 1), (2, 1),
(5, 2), (6, 2),
(9, 3), (10, 3),
(13, 4), (14, 4),
(17, 5), (18, 5),
(21, 6), (22, 6),
(25, 7), (26, 7);

INSERT INTO ClubStatistics (ClubID, Budget, MemberCount, ClubStatus) VALUES
(1, 500000, 0, '활성'),
(2, 300000, 0, '활성'),
(3, 700000, 0, '활성'),
(4, 600000, 0, '활성'),
(5, 500000, 0, '활성'),
(6, 500000, 0, '활성'),
(7, 300000, 0, '활성');

UPDATE ClubStatistics cs
SET MemberCount = (
    SELECT COUNT(*)
    FROM Belong b
    WHERE b.ClubID = cs.ClubID
);