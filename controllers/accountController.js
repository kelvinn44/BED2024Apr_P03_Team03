const Account = require('../models/account');

// Function to get user details
async function getUser(req, res) {
  try {
    const user = await Account.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Function to handle user login
async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await Account.getUserByEmail(email);
    if (user && user.password === password) {
      // For simplicity, we directly compare the plain-text password (To be updated later with hashed passwords and JWT implementation)
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
};

// Function to handle user sign up
async function createUser(req, res) {
  const { firstname, lastname, email, phone_number, password } = req.body;
  try {
    const newUser = await Account.createUser(firstname, lastname, email, phone_number, password);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === 'Email or phone number already in use') {
      res.status(400).send(error.message);
    } else {
      res.status(500).send('Server error');
    }
  }
};

// Function to update user details
async function updateUser(req, res) {
  const { id } = req.params;
  const { firstname, lastname, email, phone_number, password } = req.body;

  try {
      const updatedUser = await Account.updateUser(id, firstname, lastname, email, phone_number, password);
      res.json({ user: updatedUser });
  } catch (error) {
      res.status(500).send('Server error');
  }
};
  
module.exports = {
    getUser,
    loginUser,
    createUser,
    updateUser,
};
