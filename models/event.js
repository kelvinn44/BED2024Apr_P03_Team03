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

  // Method to get all events
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

  // Method to get events by event id
  static async getEventById(eventId) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Event WHERE event_id = @eventId`;

    const request = connection.request();
    request.input('eventId', sql.Int, eventId);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new Event(
          result.recordset[0].event_id,
          result.recordset[0].event_title,
          result.recordset[0].description,
          result.recordset[0].event_date,
          result.recordset[0].location
        )
      : null;
  }

  // Method to create an event
  static async createEvent(newEventData, accountId) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `
        INSERT INTO Event (account_id, event_title, description, event_date, location)
        VALUES (@accountId, @eventTitle, @description, @eventDate, @location);
        SELECT SCOPE_IDENTITY() AS event_id;
      `;
  
      const request = connection.request();
      request.input('accountId', sql.Int, accountId);
      request.input('eventTitle', sql.NVarChar, newEventData.event_title);
      request.input('description', sql.NVarChar, newEventData.description);
      request.input('eventDate', sql.DateTime, newEventData.event_date);
      request.input('location', sql.NVarChar, newEventData.location);
  
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      const insertedId = result.recordset[0].event_id;
      const newEvent = new Event(insertedId, newEventData.event_title, newEventData.description, newEventData.event_date, newEventData.location);
      return newEvent;
    } catch (error) {
      throw new Error('Error creating event');
    }
  }

  // Method to update an event
  static async updateEvent(eventId, newEventData) {
    const connection = await sql.connect(dbConfig);
  
    const sqlQuery = `
      UPDATE Event
      SET event_title = @eventTitle,
          description = @description,
          event_date = @eventDate,
          location = @location
      WHERE event_id = @eventId
    `;
  
    const request = connection.request();
    request.input('eventId', sql.Int, eventId);
    request.input('eventTitle', sql.NVarChar, newEventData.event_title || null);
    request.input('description', sql.NVarChar, newEventData.description || null);
    request.input('eventDate', sql.DateTime, newEventData.event_date || null);
    request.input('location', sql.NVarChar, newEventData.location || null);
  
    await request.query(sqlQuery);
  
    connection.close();
  
    return this.getEventById(eventId);
  }
  
  // Method to update an event
  static async deleteEvent(eventId) {
    try {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `DELETE FROM Event WHERE event_id = @eventId`;
  
      const request = connection.request();
      request.input('eventId', sql.Int, eventId);
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error('Error deleting event');
    }
  }
}

module.exports = Event;