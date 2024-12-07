-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS ClubManagement;

-- 데이터베이스 사용
USE ClubManagement;

-- 회원 테이블
CREATE TABLE IF NOT EXISTS Member (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    join_date DATE NOT NULL,
    position VARCHAR(30),
    status VARCHAR(20) NOT NULL
);

-- 관리자 테이블
CREATE TABLE IF NOT EXISTS Administrator (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20)
);

-- 동아리 테이블
CREATE TABLE IF NOT EXISTS Club (
    club_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    advisor VARCHAR(50),
    description TEXT,
    main_activities TEXT,
    status VARCHAR(20) NOT NULL,
    president_member_id INT,
    admin_id INT,
    FOREIGN KEY (president_member_id) REFERENCES Member(member_id),
    FOREIGN KEY (admin_id) REFERENCES Administrator(admin_id)
);

-- 활동 테이블
CREATE TABLE IF NOT EXISTS Activity (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    club_id INT NOT NULL,
    FOREIGN KEY (club_id) REFERENCES Club(club_id)
);

-- 소속 테이블
CREATE TABLE IF NOT EXISTS Membership (
    member_id INT NOT NULL,
    club_id INT NOT NULL,
    role VARCHAR(30),
    PRIMARY KEY (member_id, club_id),
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (club_id) REFERENCES Club(club_id)
);

-- 참여 테이블
CREATE TABLE IF NOT EXISTS Participation (
    member_id INT NOT NULL,
    activity_id INT NOT NULL,
    PRIMARY KEY (member_id, activity_id),
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (activity_id) REFERENCES Activity(activity_id)
);

-- 동아리 신청 테이블
CREATE TABLE IF NOT EXISTS ClubApplication (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    club_name VARCHAR(100) NOT NULL,
    advisor VARCHAR(50),
    president_candidate_member_id INT,
    applicant_member_id INT,
    application_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    admin_id INT,
    FOREIGN KEY (president_candidate_member_id) REFERENCES Member(member_id),
    FOREIGN KEY (applicant_member_id) REFERENCES Member(member_id),
    FOREIGN KEY (admin_id) REFERENCES Administrator(admin_id)
);

-- 가입 신청 테이블
CREATE TABLE IF NOT EXISTS MembershipApplication (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    club_id INT NOT NULL,
    application_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (club_id) REFERENCES Club(club_id)
);

-- 탈퇴 신청 테이블
CREATE TABLE IF NOT EXISTS WithdrawalApplication (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    club_id INT NOT NULL,
    application_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (member_id) REFERENCES Member(member_id),
    FOREIGN KEY (club_id) REFERENCES Club(club_id)
);

-- 활동 일정 테이블
CREATE TABLE IF NOT EXISTS ActivitySchedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(100),
    content TEXT,
    FOREIGN KEY (activity_id) REFERENCES Activity(activity_id)
);

-- 예산 내역 테이블
CREATE TABLE IF NOT EXISTS BudgetUsage (
    usage_id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    usage_date DATE NOT NULL,
    description TEXT,
    FOREIGN KEY (club_id) REFERENCES Club(club_id)
);
