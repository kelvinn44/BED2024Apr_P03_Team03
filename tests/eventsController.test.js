const Event = require("../models/event");
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require("../controllers/eventsController");

jest.mock("../models/event");

describe("Events Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAllEvents should return all events", async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

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

    Event.getAllEvents.mockResolvedValue(mockEvents);

    await getAllEvents(req, res);

    expect(res.json).toHaveBeenCalledWith(mockEvents);
  });

  test("getEventById should return the event with the given ID", async () => {
    const req = { params: { id: "1" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const mockEvent = {
      event_id: 1,
      event_title: "Event 1",
      description: "Description 1",
      event_date: new Date(),
      location: "Location 1",
      account_id: 1,
    };

    Event.getEventById.mockResolvedValue(mockEvent);

    await getEventById(req, res);

    expect(res.json).toHaveBeenCalledWith(mockEvent);
  });

  test("createEvent should create a new event and return it", async () => {
    const req = {
      body: {
        account_id: 1,
        event_title: "New Event",
        description: "New Description",
        event_date: new Date(),
        location: "New Location",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    const mockCreatedEvent = { ...req.body, event_id: 1 };

    Event.createEvent.mockResolvedValue(mockCreatedEvent);

    await createEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCreatedEvent);
  });

  test("updateEvent should update the event and return the updated event", async () => {
    const req = {
      params: { id: "1" },
      body: {
        event_title: "Updated Event",
        description: "Updated Description",
        event_date: new Date(),
        location: "Updated Location",
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const mockUpdatedEvent = { ...req.body, event_id: 1 };

    Event.updateEvent.mockResolvedValue(mockUpdatedEvent);

    await updateEvent(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUpdatedEvent);
  });

  test("deleteEvent should delete the event and return 204 status", async () => {
    const req = { params: { id: "1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    Event.deleteEvent.mockResolvedValue(true);

    await deleteEvent(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
