const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(user_id, username, passwordHash, role) {
    this.user_id = user_id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
    // this.email = email; //previous practical
  }

  static async createUser(newUser) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Insert the new user into the Users table
      const insertQuery = `INSERT INTO Users (username, passwordHash, role) 
                           OUTPUT INSERTED.user_id, INSERTED.username, INSERTED.passwordHash, INSERTED.role
                           VALUES (@username, @passwordHash, @role)`;

      const request = connection.request();
      request.input('username', sql.VarChar, newUser.username);
      request.input('passwordHash', sql.VarChar, newUser.passwordHash);
      request.input('role', sql.VarChar, newUser.role);

      const result = await request.query(insertQuery);

      // Extract the inserted user's data from the result
      const insertedUser = result.recordset[0];
      return new User(insertedUser.user_id, insertedUser.username, insertedUser.passwordHash, insertedUser.role);
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  // checks if username already exists in the database
  static async getUserByUsername(username) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);
      const query = `SELECT * FROM Users WHERE username = @username`;
      const request = connection.request();
      request.input("username", sql.VarChar, username);
      const result = await request.query(query);

      return result.recordset[0]
        ? new User(
            result.recordset[0].user_id,
            result.recordset[0].username,
            result.recordset[0].passwordHash,
            result.recordset[0].role
          )
        : null;
    } catch (err) {
      console.error("Error retrieving user by username:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async getAllUsers() {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Select all users from the Users table
      const selectQuery = `SELECT * FROM Users`;
      const request = connection.request();
      const result = await request.query(selectQuery);

      // Map the result to an array of User objects
      return result.recordset.map(row => new User(row.user_id, row.username, row.passwordHash, row.role));
    } catch (err) {
      console.error("Error retrieving users:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async getUserById(id) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Select user by ID from the Users table
      const selectQuery = `SELECT * FROM Users WHERE user_id = @id`;
      const request = connection.request();
      request.input('id', sql.Int, id);
      const result = await request.query(selectQuery);

      // Return the user object or null if not found
      if (result.recordset.length > 0) {
        const row = result.recordset[0];
        return new User(row.user_id, row.username, row.passwordHash, row.role);
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error retrieving user:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async updateUser(id, updatedUser) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Update user information in the Users table
      const updateQuery = `UPDATE Users
                           SET username = @username, role = @role
                           WHERE user_id = @id`;
      const request = connection.request();
      request.input('id', sql.Int, id);
      request.input('username', sql.VarChar, updatedUser.username);
      request.input('role', sql.VarChar, updatedUser.role);

      await request.query(updateQuery);

      // Optionally return updated user information
      return await User.getUserById(id);
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async deleteUser(id) {
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      // Delete user from the Users table
      const deleteQuery = `DELETE FROM Users WHERE user_id = @id`;
      const request = connection.request();
      request.input('id', sql.Int, id);

      await request.query(deleteQuery);

      return { message: "User deleted successfully" };
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    } finally {
      if (connection) {
        connection.close();
      }
    }
  }

  static async searchUsers(searchTerm) {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT *
        FROM Users
        WHERE username LIKE '%${searchTerm}%'
        OR role LIKE '%${searchTerm}%'
      `;

      const result = await connection.request().query(query);
      return result.recordset;
    } catch (error) {
      throw new Error("Error searching users"); // Or handle error differently
    } finally {
      await connection.close(); // Close connection even on errors
    }
  }

  static async getUsersWithBooks() {
    const connection = await sql.connect(dbConfig);

    try {
      const query = `
        SELECT u.user_id, u.username, u.role, b.book_id, b.title, b.author, b.availability
        FROM Users u
        LEFT JOIN UserBooks ub ON ub.user_id = u.user_id
        LEFT JOIN Books b ON ub.book_id = b.book_id
        ORDER BY u.username;
      `;

      const result = await connection.request().query(query);

      // Group users and their books
      const usersWithBooks = {};
      for (const row of result.recordset) {
        const userId = row.user_id;
        if (!usersWithBooks[userId]) {
          usersWithBooks[userId] = {
            user_id: userId,
            username: row.username,
            role: row.role,
            books: [],
          };
        }
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
          availability: row.availability,
        });
      }

      return Object.values(usersWithBooks);
    } catch (error) {
      throw new Error("Error fetching users with books");
    } finally {
      await connection.close();
    }
  }
}

module.exports = User;
