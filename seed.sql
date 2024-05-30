-- for our database script
CREATE DATABASE BED_Assignment_DB;

CREATE TABLE Account (
    account_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(16) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user'
);

INSERT INTO Account (name, email, phone_number, password)
VALUES ('JohnDoe', 'john.doe@example.com', '1234567890', 'password123');

CREATE TABLE Donation (
    donation_id INT IDENTITY(1,1) PRIMARY KEY,
    account_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    donation_date DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (account_id) REFERENCES Account(account_id)
);

CREATE TABLE Event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    account_id INT NOT NULL,
    name VARCHAR(20) NOT NULL UNIQUE,
    description VARCHAR(100) NOT NULL UNIQUE
)

CREATE TABLE EventSignUp (
    applicant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(10) NOT NULL UNIQUE,
)

CREATE TABLE Forum (
    forum_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL UNIQUE,
    body_text VARCHAR(100) NOT NULL UNIQUE
)

