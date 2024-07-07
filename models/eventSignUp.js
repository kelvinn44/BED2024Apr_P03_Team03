const sql = require("mssql");
const dbConfig = require("../dbConfig");

class EventSignUp {
    constructor(signup_id, event_id, account_id, event_title, firstname, lastname, email, phone_number, signup_date) {
        this.signup_id = signup_id;
        this.event_id = event_id;
        this.account_id = account_id;
        this.event_title = event_title;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone_number = phone_number;
        this.signup_date = signup_date;
    }

    // Method to get event sign ups by account id
    static async getEventSignUpByAccId(accountId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM EventSignUp WHERE account_id = @accountId`;

        const request = connection.request();
        request.input('accountId', sql.Int, accountId);
        const result = await request.query(sqlQuery);

        connection.close();

        const signups = result.recordset.map(row => new EventSignUp(
            row.signup_id,
            row.event_id,
            row.account_id,
            row.event_title,
            row.firstname,
            row.lastname,
            row.email,
            row.phone_number,
            row.signup_date
        ));

        return signups;
    }
      
    // Method to create an event
    static async createEventSignUp(eventSignUpData, accountId) {
      try {
          const connection = await sql.connect(dbConfig);
          const sqlQuery = `
              INSERT INTO EventSignUp (event_id, account_id, event_title, firstname, lastname, email, phone_number, signup_date)
              VALUES (@eventId, @accountId, @eventTitle, @firstname, @lastname, @email, @phoneNumber, @signupDate);
              SELECT SCOPE_IDENTITY() AS signup_id;
          `;

          const request = connection.request();
          request.input('eventId', sql.Int, eventSignUpData.event_id);
          request.input('accountId', sql.Int, accountId || null);
          request.input('eventTitle', sql.NVarChar, eventSignUpData.event_title || null);
          request.input('firstname', sql.NVarChar, eventSignUpData.firstname || null);
          request.input('lastname', sql.NVarChar, eventSignUpData.lastname || null);
          request.input('email', sql.NVarChar, eventSignUpData.email || null);
          request.input('phoneNumber', sql.NVarChar, eventSignUpData.phone_number || null);
          request.input('signupDate', sql.DateTime, eventSignUpData.signup_date);

          const result = await request.query(sqlQuery);

          connection.close();

          const insertedId = result.recordset[0].signup_id;
          const newEventSignUp = new EventSignUp(
              insertedId,
              eventSignUpData.event_id,
              accountId,
              eventSignUpData.event_title,
              eventSignUpData.firstname,
              eventSignUpData.lastname,
              eventSignUpData.email,
              eventSignUpData.phone_number,
              eventSignUpData.signup_date
          );
          return newEventSignUp;
      } catch (error) {
          throw new Error('Error creating event sign up');
      }
  }
}

module.exports = EventSignUp;