const Event = require("../models/event");

const getAllEvents = async (req, res) => {
    try {
      const events = await Event.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving events");
    }
  };

const createEvent = async (req, res) => {
  const newEvent = req.body;
  const accountId = req.body.account_id;

  try {
    const createdEvent = await Event.createEvent(newEvent, accountId);
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating event");
  }
};

module.exports = {
    getAllEvents,
    createEvent,
  };