class Event {
  constructor(event_id, event_title, description, event_date, location) {
    this.event_id = event_id;
    this.event_title = event_title;
    this.description = description;
    this.event_date = event_date;
    this.location = location;
  }

  static async getAllEvents() {
      // Replace this with your actual logic to retrieve all books from the data source (e.g., database)
      return events; // Assuming 'books' is your in-memory array (for simplicity)
    }

  static async createEvent(newEventData) {
      const events = await this.getAllEvents(); // Await the promise to get books
      const newEvent = new Event(
          events.length + 1,
          newEventData.event_title,
          newEventData.description,
          newEventData.event_date,
          newEventData.location
      );
      // Replace this with your actual logic to create a book in the data source (e.g., database)
      events.push(newEvent); // Assuming in-memory array (for simplicity)
      return newEvent;
  }
}

Event.events = [
  new Event(1, "Event Title 1", "Description 1", "2024-06-20", "Central Park, NYC"),
  new Event(2, "Event Title 2", "Description 2", "2024-06-22", "Downtown Convention Center"),
  new Event(3, "Event Title 3", "Description 3", "2024-06-25", "City Library")
];

module.exports = Event;