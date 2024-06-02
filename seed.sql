-- Database script
CREATE DATABASE BED_Assignment_DB;

-- Use after creating the database
USE BED_Assignment_DB;

CREATE TABLE Account (
    account_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(20) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'User',
    recurring_donation_amount DECIMAL(10, 2) NULL
);

CREATE TABLE Donation (
    donation_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    donation_date DATETIME2 DEFAULT SYSDATETIME(),
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

CREATE TABLE Event (
    event_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    event_date DATETIME2 NOT NULL,
    location VARCHAR(255) NOT NULL,
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

CREATE TABLE EventSignUp (
    signup_id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    account_id INT NULL,
    name VARCHAR(50) NULL,
    email VARCHAR(100) NULL,
    phone_number VARCHAR(30) NULL,
    signup_date DATETIME2 DEFAULT SYSDATETIME(),
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
)

-- Sample data
INSERT INTO Account (name, email, phone_number, password, recurring_donation_amount)
VALUES ('John Doe', 'john@email.com', '98887888', 'Pass@123', 10.00);

INSERT INTO Account (name, email, phone_number, password, role)
VALUES 
    ('Admin1', 'admin1@willinghearts.com', '91234567', 'AdminPass@123', 'EventAdmin'),
    ('Admin2', 'admin2@willinghearts.com', '67891234', 'PassAdmin@8888', 'ForumMod');

INSERT INTO Event (account_id, name, description, event_date, location)
VALUES (2, 'Food Drive', 'Collecting food for the needy.', '2024-08-12 10:00:00', 'Community Center');

-- Example event sign-ups
-- User John Doe signing up
INSERT INTO EventSignUp (event_id, account_id)
VALUES (1, 1);

-- Guest signing up
INSERT INTO EventSignUp (event_id, name, email, phone_number)
VALUES (1, 'Jane Smith', 'jane@example.com', '99998888');

INSERT INTO Donation (account_id, amount)
VALUES (1, 50.00);

INSERT INTO Forum (account_id, title, content)
VALUES (1, 'Community service 1 advice', 'Hi, here are my tips for Community service 1: <ul><li>Be kind</li><li>Have fun</li><li>Make new friends</li></ul>');
