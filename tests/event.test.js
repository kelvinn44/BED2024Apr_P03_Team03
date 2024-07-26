const sql = require("mssql");
const Event = require("../models/event");

jest.mock("mssql");

describe("Event Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAllEvents should return all events", async () => {
    const mockEvents = [
      {
        event_id: 1,
        event_title: "Event 1",
        description: "Description 1",
        event_date: new Date(),
        location: "Location 1",
        account_id: 1,
      },
    ];

    sql.connect.mockResolvedValue({
      request: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: mockEvents }),
      close: jest.fn(),
    });

    const events = await Event.getAllEvents();

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject(mockEvents[0]);
  });

  test("getEventById should return the event with the given ID", async () => {
    const mockEvent = {
      event_id: 1,
      event_title: "Event 1",
      description: "Description 1",
      event_date: new Date(),
      location: "Location 1",
      account_id: 1,
    };

    sql.connect.mockResolvedValue({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [mockEvent] }),
      close: jest.fn(),
    });

    const event = await Event.getEventById(1);

    expect(event).toMatchObject(mockEvent);
  });

  test("createEvent should insert a new event and return true", async () => {
    const newEvent = {
      account_id: 1,
      event_title: "New Event",
      description: "New Description",
      event_date: new Date(),
      location: "New Location",
    };

    sql.connect.mockResolvedValue({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
      close: jest.fn(),
    });

    const result = await Event.createEvent(newEvent);

    expect(result).toBe(true);
  });

  test("updateEvent should update the event and return the updated event", async () => {
    const updatedEvent = {
      event_id: 1,
      event_title: "Updated Event",
      description: "Updated Description",
      event_date: new Date(),
      location: "Updated Location",
      account_id: 1,
    };

    sql.connect
      .mockResolvedValueOnce({
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
        close: jest.fn(),
      })
      .mockResolvedValueOnce({
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [updatedEvent] }),
        close: jest.fn(),
      });

    const result = await Event.updateEvent(1, updatedEvent);

    expect(result).toMatchObject(updatedEvent);
  });

  test("deleteEvent should delete the event and return true", async () => {
    sql.connect.mockResolvedValue({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
      close: jest.fn(),
    });

    const result = await Event.deleteEvent(1);

    expect(result).toBe(true);
  });
});

