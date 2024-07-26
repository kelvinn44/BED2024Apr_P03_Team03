const Event = require("../models/event");

// Function to get all event details
const getAllEvents = async (req, res) => {
    try {
      const events = await Event.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving events");
    }
  };

// Function to get event by event id
const getEventById = async (req, res) => {
  const eventId = parseInt(req.params.id);
  try {
    const event = await Event.getEventById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving event");
  }
};

// Function to create a new event
const createEvent = async (req, res) => {
  const newEvent = req.body;
  const accountId = req.body.id;

  try {
    const createdEvent = await Event.createEvent(newEvent, accountId);
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating event");
  }
};

// Function to update event details
const updateEvent = async (req, res) => {
  const eventId = parseInt(req.params.id);
  const newEventData = req.body;

  try {
    const updatedEvent = await Event.updateEvent(eventId, newEventData);
    if (!updatedEvent) {
      return res.status(404).send("Event not found");
    }
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating event");
  }
};

// Function to delete event
const deleteEvent = async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    const success = await Event.deleteEvent(eventId);
    if (!success) {
      return res.status(404).send("Event not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting event");
  }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
  };