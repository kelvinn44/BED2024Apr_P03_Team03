const sql = require('mssql');
const dbConfig = require('../dbConfig');

class Donation {
    constructor(donation_id, account_id, amount, firstname) {
        this.donation_id = donation_id;
        this.account_id = account_id;
        this.amount = amount;
        this.firstname = firstname;
    }

    static async getDonations() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = 'SELECT Donation.donation_id, Donation.account_id, Account.firstname, Donation.amount FROM Donation INNER JOIN Account ON Account.account_id = Donation.account_id ORDER BY Donation.donation_date DESC OFFSET 0 ROWS FETCH NEXT 5 ROWS ONLY';
            const request = connection.request();
            const result = await request.query(sqlQuery);
            return result.recordset.map(donation => new Donation(donation.donation_id, donation.account_id, donation.amount, donation.firstname));
        } catch (error) {
            throw new Error('Error fetching donations');
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    static async createDonation(account_id, amount) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `INSERT INTO Donation (account_id, amount, donation_date) VALUES (@account_id, @amount, GETDATE()); SELECT SCOPE_IDENTITY() AS donation_id;`;
            const request = connection.request();
            request.input('account_id', sql.Int, account_id);
            request.input('amount', sql.Decimal(10, 2), amount);
            const result = await request.query(sqlQuery);
            const donationId = result.recordset[0].donation_id;
            const fetchQuery = `SELECT Donation.donation_id, Donation.account_id, Account.firstname, Donation.amount FROM Donation INNER JOIN Account ON Account.account_id = Donation.account_id WHERE Donation.donation_id = @donationId`;
            request.input('donationId', sql.Int, donationId);
            const fetchResult = await request.query(fetchQuery);
            const donation = fetchResult.recordset[0];
            return { donation_id: donation.donation_id, account_id: donation.account_id, firstname: donation.firstname, amount: donation.amount };
        } catch (error) {
            throw new Error('Error creating donation');
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    static async getDonationsByAccountId(account_id) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT donation_id, account_id, amount, donation_date FROM Donation WHERE account_id = @account_id`;
            const request = connection.request();
            request.input('account_id', sql.Int, account_id);
            const result = await request.query(sqlQuery);
            return result.recordset;
        } catch (error) {
            throw new Error('Error fetching donations by account ID');
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    static async getAllDonations() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT donation_id, account_id, amount, donation_date FROM Donation`;
            const request = connection.request();
            const result = await request.query(sqlQuery);
            return result.recordset;
        } catch (error) {
            throw new Error('Error fetching all donations');
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    static async getRecurringDonationByAccountId(account_id) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `SELECT recurring_donation_amount FROM Account WHERE account_id = @account_id`;
            const request = connection.request();
            request.input('account_id', sql.Int, account_id);
            const result = await request.query(sqlQuery);
            return result.recordset[0];
        } catch (error) {
            throw new Error('Error fetching recurring donation');
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }

    static async updateRecurringDonation(account_id, amount) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const sqlQuery = `UPDATE Account SET recurring_donation_amount = @amount WHERE account_id = @account_id`;
            const request = connection.request();
            request.input('account_id', sql.Int, account_id);
            request.input('amount', sql.Decimal(10, 2), amount);
            await request.query(sqlQuery);
            return { account_id, amount };
        } catch (error) {
            throw new Error('Error updating recurring donation');
        } finally {
            if (connection) {
                await connection.close();
            }
        }
    }
}

module.exports = Donation;

