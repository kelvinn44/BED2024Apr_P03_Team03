-- Database script (run first)
CREATE DATABASE BED_Assignment_DB;

-- Use after creating the database (run second)
USE BED_Assignment_DB;

-- After changing to BED_Assignment_DB database, run the following (run third):
-- Table creation
CREATE TABLE Account (
    account_id INT IDENTITY(1,1) PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(20) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'User',
    recurring_donation_amount DECIMAL(10, 2) NULL
);

CREATE TABLE Donation (
    donation_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    donation_date DATETIME DEFAULT SYSDATETIME(),
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

CREATE TABLE Event (
    event_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    event_title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

CREATE TABLE EventSignUp (
    signup_id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    account_id INT NULL,
    firstname VARCHAR(50) NULL,
    lastname VARCHAR(50) NULL,
    email VARCHAR(100) NULL,
    phone_number VARCHAR(30) NULL,
    signup_date DATETIME DEFAULT SYSDATETIME(),
    FOREIGN KEY (event_id) REFERENCES Event(event_id),
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

CREATE TABLE Forum (
    post_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    post_date DATETIME DEFAULT GETDATE(),
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

-- Run after creating tables (run fourth):
-- Sample data
-- user account with recurring donation:
INSERT INTO Account (firstname, lastname, email, phone_number, password, recurring_donation_amount)
VALUES 
    ('John', 'Doe', 'john@email.com', '98887888', 'Pass@123', 10.00),
    ('Jane', 'Lee', 'jane@email.com', '65657878', 'Zoom@999', 5.00),
    ('Jack', 'Hert', 'jack@email.com', '44445555', 'Zim@333', 1.00),
    ('Paul', 'Adams', 'paul@email.com', '55566778', 'Paul@555', 20.00),
    ('Laura', 'Smith', 'laura@email.com', '23456789', 'Laura$234', 15.00);

-- user account with no recurring donation:
INSERT INTO Account (firstname, lastname, email, phone_number, password)
VALUES 
    ('Mary', 'Lim', 'mary@email.com', '12345678', 'Abc$321'),
    ('Jill', 'Lim', 'jill@email.com', '89897676', 'Jill#404'),
    ('Kevin', 'Hart', 'kevin@email.com', '87654321', 'Kevin@Hart123'),
    ('Tom', 'Cruise', 'tom@email.com', '98765432', 'Tom@Cruise456'),
    ('Emily', 'Blunt', 'emily@email.com', '12398745', 'Emily$Blunt789');

-- admin accounts:
INSERT INTO Account (firstname, lastname, email, phone_number, password, role)
VALUES 
    ('Admin1', '.', 'admin1@willinghearts.com', '91234567', 'AdminPass@123', 'EventAdmin'),
    ('Admin2', '.', 'admin2@willinghearts.com', '67891234', 'PassAdmin@8888', 'ForumMod'),
    ('EventAdmin2', '.', 'EventAdmin2@willinghearts.com', '87769000', 'Password@8888', 'EventAdmin'),
    ('ForumMod2', '.', 'ForumMod2@willinghearts.com', '88887777', 'Mod@Super123', 'ForumMod');

-- run after creating accounts (run fifth):
-- event examples:
INSERT INTO Event (account_id, event_title, description, event_date, location)
VALUES 
    (11, 'Food Drive', 'Collecting food for the needy.', '2024-08-12 10:00:00', 'Community Center'),
    (11, 'Charity Run', 'A 5K run to raise funds for our food charity.', '2024-09-15 08:00:00', 'City Park'),
    (13, 'Food Distribution', 'Join our food distribution event to help distrubute food to needy residents.', '2024-09-25 10:00:00', 'Hill Grove Residences');

-- event sign-ups examples:
-- user John Doe signing up for event (populate using MSSQL command would show null for firstname, lastname, email, phone_number, but
-- when sent using the app, the user details would be populated.)
INSERT INTO EventSignUp (event_id, account_id, signup_date)
VALUES 
    (1, 1, '2024-01-01 10:00:00'),
    (2, 5, '2024-02-15 14:30:00'),
    (3, 2, '2024-03-10 09:45:00');

-- guest (non-logged in users) signing up for event examples:
INSERT INTO EventSignUp (event_id, firstname, lastname, email, phone_number, signup_date)
VALUES 
    (1, 'Jane', 'Smith', 'jane@example.com', '99998888', '2024-01-20 11:00:00'),
    (3, 'Alice', 'Johnson', 'alice.j@example.com', '77776666', '2024-03-15 12:30:00'),
    (1, 'Bob', 'Brown', 'bob.brown@example.com', '66665555', '2024-01-25 13:45:00'),
    (2, 'Carol', 'White', 'carol.white@example.com', '55554444', '2024-02-28 15:50:00');

-- donation examples:
-- e.g. user John Doe donated $50 on 15/01/2024 & 10/07/2024 etc.
INSERT INTO Donation (account_id, donation_date, amount)
VALUES 
    (1, '2024-01-15 10:00:00', 50.00),
    (2, '2024-02-20 14:30:00', 100.00),
    (3, '2024-03-05 09:45:00', 30.00),
    (7, '2024-04-12 16:20:00', 20.00),
    (6, '2024-05-18 11:10:00', 10.00),
    (5, '2024-06-22 13:55:00', 5.00),
    (1, '2024-07-10 15:35:00', 15.00),
    (2, '2024-08-25 12:40:00', 25.00);

-- forum post examples:
INSERT INTO Forum (account_id, title, content, post_date)
VALUES 
    (1, 'Charity run advice', 'Hi, here are my tips for the upcoming charity run: <ul><li>Be kind</li><li>Have fun</li><li>Make new friends</li></ul>', '2024-01-10 08:30:00'),
    (2, 'Choosing your community service', 'In a dilemma of picking your type of community service? Here''s some helpful advice I can give! <ul><li>Think about what volunteering can offer you </li><li>Know what you have to offer an organization</li><li>Decide how much time you can offer towards volunteering</li></ul>', '2024-02-20 14:45:00'),
    (3, 'Tips for Successful Fundraising', 'Fundraising can be challenging, but here are some tips to help you succeed: <ul><li>Set clear goals</li><li>Engage your community</li><li>Be transparent about how funds will be used</li></ul>', '2024-03-15 09:20:00'),
    (4, 'Volunteering for the First Time', 'Volunteering for the first time? Here''s what you need to know: <ul><li>Choose a cause you care about</li><li>Be open to learning new skills</li><li>Have patience and stay positive</li></ul>', '2024-04-05 16:10:00');
