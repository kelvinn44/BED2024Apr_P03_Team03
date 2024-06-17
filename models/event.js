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

  static async createEvent(newEventData) {
      const events = await this.getAllEvents();
      const newEvent = new Event(
          events.length + 1,
          newEventData.event_title,
          newEventData.description,
          newEventData.event_date,
          newEventData.location
      );
      events.push(newEvent);
      return newEvent;
  }
}

module.exports = Event;