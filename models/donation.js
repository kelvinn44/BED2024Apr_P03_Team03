//const sql = require('mssql');
//const dbConfig = require('../dbConfig');

class Donation {
    constructor(donation_id, account_id, amount, date) {
      this.donation_id = donation_id;
      this.account_id = account_id;
      this.amount = amount;
      this.date = date;
    }
  
    // Method to get 5 latest donations
    static async getDonations() {
      try {
        const connection = await sql.connect(dbConfig);
        //const result = await pool.request()
        const sqlQuery = ('SELECT Account.firstname, Donation.amount FROM Donation INNER JOIN Account ON Account.account_id = Donation.account_id ORDER BY Donation.donation_date DESC OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY');

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();
        return result.recordset.map(
            donation => new Donation(donation.account_id, donation.amount)
        );
      } catch (error) {
        throw new Error('Error fetching donations');
      }
    }


    static async createDonation(account_id, amount) {
        try {
            const connection = await sql.connect(dbConfig); // Declare the 'connection' variable
            const sqlQuery = `INSERT INTO Donation (account_id, amount, donation_date) VALUES (@account_id, @amount, GETDATE()); SELECT SCOPE_IDENTITY() AS donation_id;`;
    
            const request = connection.request(); // Use the 'connection' variable
            request.input('account_id', sql.Int, account_id);
            request.input('amount', sql.Decimal(10, 2), amount);
            const result = await request.query(sqlQuery);
    
            connection.close();
    
            return this.getDonations(result.recordset[0].donation_id);
        } catch (error) {
            throw new Error('Error creating donation');
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }
}

module.exports = Donation;