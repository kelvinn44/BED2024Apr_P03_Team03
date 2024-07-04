const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
  constructor(user_id, username, passwordHash, role) {
    this.user_id = user_id;
    this.username = username;
    // this.email = email; //Previous practical
    this.passwordHash = passwordHash;
    this.role = role;
  }

  // From previous practical
  //   static async createUser(newUser) {
  //     let connection;
  //     try {
  //       connection = await sql.connect(dbConfig);

  //       // Insert the new user into the Users table
  //       const insertQuery = `INSERT INTO Users (username, email)
  //                            OUTPUT INSERTED.id, INSERTED.username, INSERTED.email
  //                            VALUES (@username, @email)`;

  //       const request = connection.request();
  //       request.input('username', sql.VarChar, newUser.username);
  //       request.input('email', sql.VarChar, newUser.email);

  //       const result = await request.query(insertQuery);

  //       // Extract the inserted user's data from the result
  //       const insertedUser = result.recordset[0];
  //       return new User(insertedUser.id, insertedUser.username, insertedUser.email);
  //     } catch (err) {
  //       console.error("Error creating user:", err);
  //       throw err;
  //     } finally {
  //       if (connection) {
  //         connection.close();
  //       }
  //     }
  //   }

  // Main function #1
  static async register(newUser) {
    // Check if username exists
    const existingUser = await User.getUserByUsername(newUser.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
  
    let connection;
    try {
      connection = await sql.connect(dbConfig);

      const query = `
        INSERT INTO Users (username, passwordHash, role) 
        OUTPUT INSERTED.user_id, INSERTED.username, INSERTED.passwordHash, INSERTED.role
        VALUES (@username, @passwordHash, @role)
      `;
  
      const request = connection.request();
      request.input('username', sql.VarChar, newUser.username);
      request.input('passwordHash', sql.VarChar, hashedPassword);
      request.input('role', sql.VarChar, newUser.role);
  
      const result = await request.query(query);
  
      if (!result.recordset || result.recordset.length === 0) {
        throw new Error('User insertion failed: No data returned');
      }

      const insertedUser = result.recordset[0];
      return new User(insertedUser.user_id, insertedUser.username, insertedUser.passwordHash, insertedUser.role);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  // Supporting function for register #2
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
      return result.recordset.map(
        (row) => new User(row.user_id, row.username, row.passwordHash, row.role)
      );
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
      request.input("id", sql.Int, id);
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
                           SET username = @username, passwordHash = @passwordHash, role = @role
                           WHERE user_id = @id`;
      const request = connection.request();
      request.input("id", sql.Int, id);
      request.input("username", sql.VarChar, updatedUser.username);
      // request.input('email', sql.VarChar, updatedUser.email);
      request.input("passwordHash", sql.VarChar, updatedUser.passwordHash);
      request.input("role", sql.VarChar, updatedUser.role);

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
      request.input("id", sql.Int, id);

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
      //   OR email LIKE '%${searchTerm}%' // Previous practical

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
        SELECT u.user_id, u.username, b.book_id, b.title, b.author
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
            id: userId,
            username: row.username,
            // email: row.email,
            books: [],
          };
        }
        usersWithBooks[userId].books.push({
          id: row.book_id,
          title: row.title,
          author: row.author,
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
