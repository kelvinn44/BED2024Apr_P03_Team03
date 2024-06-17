const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Event {
  constructor(event_id, event_title, description, event_date, location) {
    this.event_id = event_id;
    this.event_title = event_title;
    this.description = description;
    this.event_date = event_date;
    this.location = location;
  }

  static async getAllEvents() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Event`;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new Event(row.event_id, row.event_title, row.description, row.event_date, row.location)
    );
  }

  static async createEvent(newEventData, accountId) {
    const connection = await sql.connect(dbConfig);
    const request = new sql.Request(connection);
  
    const result = await request.query(`
      INSERT INTO Event (account_id, event_title, description, event_date, location)
      OUTPUT INSERTED.event_id
      VALUES (${accountId}, '${newEventData.event_title}', '${newEventData.description}', '${newEventData.event_date}', '${newEventData.location}');
    `);
  
    connection.close();
  
    const insertedId = result.recordset[0].event_id;
    const newEvent = new Event(insertedId, newEventData.event_title, newEventData.description, newEventData.event_date, newEventData.location);
    return newEvent;
  }
}

module.exports = Event;