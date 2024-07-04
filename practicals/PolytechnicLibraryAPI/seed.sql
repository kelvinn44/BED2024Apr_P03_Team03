-- Create Users table
CREATE TABLE Users (
  user_id INT IDENTITY(1,1) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('member', 'librarian')) NOT NULL
);

-- Create Books table
CREATE TABLE Books (
  book_id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  availability CHAR(1) CHECK (availability IN ('Y', 'N')) NOT NULL DEFAULT 'Y'
);

-- Insert sample books
INSERT INTO Books (title, author, availability)
VALUES
  ('The Lord of the Rings', 'J.R.R. Tolkien', 'Y'),
  ('Pride and Prejudice', 'Jane Austen', 'Y'),
  ('To Kill a Mockingbird', 'Harper Lee', 'Y'),
  ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 'Y'),
  ('Dune', 'Frank Herbert', 'Y'),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Y');

-- Insert sample users (previous practical)
-- INSERT INTO Users (username, email)
-- VALUES
--   ('user1', 'user1@example.com'),
--   ('user2', 'user2@example.com'),
--   ('user3', 'user3@example.com');

-- Insert sample users
INSERT INTO Users (username, passwordHash, role)
VALUES
  ('user1', '$2a$10$ZCf8R76Cyk17KZx4ZB5XCOIVGbXsLD7/X/DfGzJ41Xqu3Wfq5W2TC', 'member'),
  ('user2', '$2a$10$tga9eGy8qZX/Hqb0RIXSNe7DKtCEyZHc2C067nQRCDEvnBOxhlWEW', 'member'),
  ('user3', '$2a$10$UzsheJH64ZacERx6HOy93.yJ3swROHsoXCOcXW/R5.7gkwnH4GSl6', 'librarian');

-- Create UserBooks table to establish relationships between users and books
CREATE TABLE UserBooks (
    user_id INT,
    book_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    PRIMARY KEY (user_id, book_id)
);

-- Insert relationships between users and books
INSERT INTO UserBooks (user_id, book_id)
VALUES
  (1, 1),  -- User 1 has book 1
  (1, 2),  -- User 1 has book 2
  (1, 4),  -- User 1 has book 4
  (2, 3),  -- User 2 has book 3
  (2, 5),  -- User 2 has book 5
  (3, 1),  -- User 3 has book 1
  (3, 6);  -- User 3 has book 6
