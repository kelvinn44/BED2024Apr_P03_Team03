const sql = require('mssql');
const dbConfig = require('../dbConfig');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

class Account {
    constructor(account_id, name, email, phone_number, password, role) {
      this.account_id = account_id;
      this.name = name;
      this.email = email;
      this.phone_number = phone_number;
      this.password = password;
      this.role = role;
    }
  
    // Method to get user by ID
    static async getUserById(id) {
      try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
          .input('id', sql.Int, id)
          .query('SELECT * FROM Account WHERE account_id = @id');
        
        if (result.recordset.length > 0) {
          const user = result.recordset[0];
          return new Account(user.account_id, user.name, user.email, user.phone_number, user.password, user.role);
        } else {
          return null;
        }
      } catch (error) {
        throw new Error('Error fetching user by ID');
      }
    }
  
    // Method to get user by email
    static async getUserByEmail(email) {
      try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
          .input('email', sql.VarChar, email)
          .query('SELECT * FROM Account WHERE email = @email');
        
        if (result.recordset.length > 0) {
          const user = result.recordset[0];
          return new Account(user.account_id, user.name, user.email, user.phone_number, user.password, user.role);
        } else {
          return null;
        }
      } catch (error) {
        throw new Error('Error fetching user by email');
      }
    }
  }
  

module.exports = Account;
