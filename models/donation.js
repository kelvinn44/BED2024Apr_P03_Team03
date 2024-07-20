const sql = require('mssql');
const dbConfig = require('../dbConfig');

class Donation {
    constructor(donation_id, account_id, amount, firstname) {
      this.donation_id = donation_id;
      this.account_id = account_id;
      this.amount = amount;
      this.firstname = firstname;
    }
  
    // Method to get 5 latest donations
    static async getDonations() {
      try {
        const connection = await sql.connect(dbConfig);
        //const result = await pool.request()
        const sqlQuery = ('SELECT Donation.donation_id, Donation.account_id, Account.firstname, Donation.amount FROM Donation INNER JOIN Account ON Account.account_id = Donation.account_id ORDER BY Donation.donation_date DESC OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY');

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();
        return result.recordset.map(
            donation => new Donation(donation.donation_id, donation.account_id, donation.amount, donation.firstname)
        );
      } catch (error) {
        throw new Error('Error fetching donations');
      }
    }

    // Method to create new one time donation
    static async createDonation(account_id, amount) {
        let connection; // Declare the 'connection' variable here to make it accessible in the 'finally' block
        try {
            const connection = await sql.connect(dbConfig); // Declare the 'connection' variable
            const sqlQuery = `INSERT INTO Donation (account_id, amount, donation_date) VALUES (@account_id, @amount, GETDATE()); SELECT SCOPE_IDENTITY() AS donation_id;`;
    
            const request = connection.request(); // Use the 'connection' variable
            request.input('account_id', sql.Int, account_id);
            request.input('amount', sql.Decimal(10, 2), amount);
            const result = await request.query(sqlQuery);
    const donationId = result.recordset[0].donation_id;
  
          // Fetch the newly created donation details
          const fetchQuery = `
              SELECT Donation.donation_id, Donation.account_id, Account.firstname, Donation.amount 
              FROM Donation 
              INNER JOIN Account ON Account.account_id = Donation.account_id 
              WHERE Donation.donation_id = @donationId
          `;
          request.input('donationId', sql.Int, donationId);
          const fetchResult = await request.query(fetchQuery);
  
    
            connection.close();
    
            const donation = fetchResult.recordset[0];
            return {
              donation_id: donation.donation_id,
              account_id: donation.account_id,
              firstname: donation.firstname,
              amount: donation.amount
          };
    
        } catch (error) {
            throw new Error('Error creating donation');
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }

    static async createRecurringDonation(account_id, amount) {
      let connection; // Declare the 'connection' variable here to make it accessible in the 'finally' block
      try {
          connection = await sql.connect(dbConfig); // Initialize the 'connection' variable
          const sqlQuery = `INSERT INTO Donation (account_id, amount, donation_date) VALUES (@account_id, @amount, GETDATE()); SELECT SCOPE_IDENTITY() AS donation_id;`;
  
          const request = connection.request(); // Use the 'connection' variable
          request.input('account_id', sql.Int, account_id);
          request.input('amount', sql.Decimal(10, 2), amount);
          const result = await request.query(sqlQuery);
          const donationId = result.recordset[0].donation_id;

          // Schedule the next donation (this is a simplified example, actual implementation may vary)
          const scheduleQuery = `
              INSERT INTO Donation (account_id, amount, donation_date) 
              VALUES (@account_id, @amount, DATEADD(month, 1, GETDATE()));
          `;
          await request.query(scheduleQuery);

          // Fetch the newly created donation details
          const fetchQuery = `
              SELECT Donation.donation_id, Donation.account_id, Account.firstname, Donation.amount 
              FROM Donation 
              INNER JOIN Account ON Account.account_id = Donation.account_id 
              WHERE Donation.donation_id = @donationId
          `;
          request.input('donationId', sql.Int, donationId);
          const fetchResult = await request.query(fetchQuery);

          connection.close();
  
          const donation = fetchResult.recordset[0];
          return {
              donation_id: donation.donation_id,
              account_id: donation.account_id,
              firstname: donation.firstname,
              amount: donation.amount
          };
  
      } catch (error) {
          throw new Error('Error creating recurring donation');
      } finally {
          if (connection) {
              connection.close();
          }
      }
  }

  // Method to get all donations for a specific account
  static async getDonationsByAccountId(account_id) {
      let connection;
      try {
          connection = await sql.connect(dbConfig);
          const sqlQuery = `
              SELECT donation_id, account_id, amount, donation_date 
              FROM Donation 
              WHERE account_id = @account_id
          `;
          const request = connection.request();
          request.input('account_id', sql.Int, account_id);
          const result = await request.query(sqlQuery);
          connection.close();
          return result.recordset;
      } catch (error) {
          throw new Error('Error fetching donations by account ID');
      } finally {
          if (connection) {
              connection.close();
          }
      }
  }

  // Method to get all donations
  static async getAllDonations() {
      let connection;
      try {
          connection = await sql.connect(dbConfig);
          const sqlQuery = `
              SELECT donation_id, account_id, amount, donation_date 
              FROM Donation
          `;
          const request = connection.request();
          const result = await request.query(sqlQuery);
          connection.close();
          return result.recordset;
      } catch (error) {
          throw new Error('Error fetching all donations');
      } finally {
          if (connection) {
              connection.close();
          }
      }
  }

  
}



module.exports = Donation;