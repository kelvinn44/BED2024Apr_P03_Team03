const EventSignUp = require("../models/eventSignUp");

// Function to get event sign ups by account id
const getEventSignUpByAccId = async (req, res) => {
  const accountId = parseInt(req.params.id);
  try {
      const eventSignUps = await EventSignUp.getEventSignUpByAccId(accountId);
      res.json(eventSignUps);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving event sign ups");
  }
};

// Function to sign up for an event
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
