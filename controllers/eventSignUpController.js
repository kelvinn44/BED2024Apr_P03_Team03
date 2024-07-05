const EventSignUp = require("../models/eventSignUp");

// Function to get event sign ups by account id
const getEventSignUpByAccId = async (req, res) => {
    const accountId = parseInt(req.params.id);
    try {
      const eventSignUps = await EventSignUp.getEventSignUpByAccId(accountId);
      if (eventSignUps.length === 0) {
        return res.status(404).send("Event sign ups not found");
      }
      res.json(eventSignUps);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving event sign ups");
    }
  };

// Function to create event sign ups
const createEventSignUp = async (req, res) => {
    const newEventSignUp = req.body;
    const accountId = req.body.account_id;
  
    try {
      const createdEventSignUp = await EventSignUp.createEventSignUp(newEventSignUp, accountId);
      res.status(201).json(createdEventSignUp);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating event sign up");
    }
  };

module.exports = {
    getEventSignUpByAccId,
    createEventSignUp
  };