const sql = require('mssql');
const dbConfig = require('../dbConfig');

class Account {
    constructor(account_id, firstname, lastname, email, phone_number, password, role, recurring_donation_amount) {
      this.account_id = account_id;
      this.firstname = firstname;
      this.lastname = lastname;
      this.email = email;
      this.phone_number = phone_number;
      this.password = password;
      this.role = role;
      this.recurring_donation_amount = recurring_donation_amount;
    }
  
    // Method to get user by ID
    static async getUserById(id) {
      try {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
        SELECT * FROM Account WHERE account_id = @id;
        `;

        const request = connection.request();
        request.input('id', sql.Int, id);
        const result = await request.query(sqlQuery);
  
        connection.close();
        
        if (result.recordset.length > 0) {
          const user = result.recordset[0];
          return new Account(user.account_id, user.firstname, user.lastname, user.email, user.phone_number, user.password, user.role
            , user.recurring_donation_amount
          );
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
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
        SELECT * FROM Account WHERE email = @email;
        `;

        const request = connection.request();
        request.input('email', sql.VarChar, email);
        const result = await request.query(sqlQuery);
  
        connection.close();
        
        if (result.recordset.length > 0) {
          const user = result.recordset[0];
          return new Account(user.account_id, user.firstname, user.lastname, user.email, user.phone_number, user.password, user.role
            , user.recurring_donation_amount
          );
        } else {
          return null;
        }
      } catch (error) {
        throw new Error('Error fetching user by email');
      }
    }

    // Method to get user by phone number
    static async getUserByPhoneNum(phone_number) {
      try {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
        SELECT * FROM Account WHERE phone_number = @phone_number;
        `;

        const request = connection.request();
        request.input('phone_number', sql.VarChar, phone_number);
        const result = await request.query(sqlQuery);
  
        connection.close();
        
        if (result.recordset.length > 0) {
          const user = result.recordset[0];
          return new Account(user.account_id, user.firstname, user.lastname, user.email, user.phone_number, user.password, user.role
            , user.recurring_donation_amount
          );
        } else {
          return null;
        }
      } catch (error) {
        throw new Error('Error fetching user by phone number');
      }
    }

    // Method to create a new user
    static async createUser(firstname, lastname, email, phone_number, password) {
      try {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
        INSERT INTO Account (firstname, lastname, email, phone_number, password, role)
                      VALUES (@firstname, @lastname, @email, @phone_number, @password, 'User');
                      SELECT SCOPE_IDENTITY() AS account_id;
        `;

        const request = connection.request();
        request.input('firstname', sql.VarChar, firstname);
        request.input('lastname', sql.VarChar, lastname);
        request.input('email', sql.VarChar, email);
        request.input('phone_number', sql.VarChar, phone_number);
        request.input('password', sql.VarChar, password);
        const result = await request.query(sqlQuery);

        const account_id = result.recordset[0].account_id;
  
        connection.close();

        return {
          account_id,
          firstname,
          lastname,
          email,
          phone_number,
          role: 'User'
      };
      } catch (error) {
          if (error.code === 'EREQUEST' && error.originalError.info.message.includes('Violation of UNIQUE KEY constraint')) {
              throw new Error('Email or phone number already in use');
          }
          throw new Error('Error creating new user');
      }
  }

  // Method to update user details
  static async updateUser(id, firstname, lastname, email, phone_number, password) {
    try {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
            UPDATE Account 
            SET firstname = @firstname, lastname = @lastname, email = @email, phone_number = @phone_number, password = @password
            WHERE account_id = @id;
        `;

        const request = connection.request();
        request.input('id', sql.Int, id);
        request.input('firstname', sql.VarChar, firstname);
        request.input('lastname', sql.VarChar, lastname);
        request.input('email', sql.VarChar, email);
        request.input('phone_number', sql.VarChar, phone_number);
        request.input('password', sql.VarChar, password);

        await request.query(sqlQuery);
        connection.close();

        return this.getUserById(id); // Return updated user details
    } catch (error) {
        throw new Error('Error updating user details');
    }
  }
}

module.exports = Account;
