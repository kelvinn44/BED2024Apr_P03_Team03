const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
    // Validate user credentials
    const user = await Account.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.account_id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '3600s' }); // Expires in 1 hour

    res.status(200).json({ message: 'Login successful', user, token });
  } catch (err) {
    console.error(err);
    res.status(500).send.json({ message: 'Internal server error' });
  }
};

// Function to handle user sign up
async function createUser(req, res) {
  const { firstname, lastname, email, phone_number, password } = req.body;

  try {
    // Validate user data
    if (!firstname || !lastname || !email || !phone_number || !password) {
      return res.status(400).json({ message: "Please provide first name, last name, email, phone number, and password" });
    }

    // Check for existing email
    const existingEmail = await Account.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check for existing phone number
    const existingPhoneNum = await Account.getUserByPhoneNum(phone_number);
    if (existingPhoneNum) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = await Account.createUser(firstname, lastname, email, phone_number, hashedPassword);

    // Generate JWT token after sign up
    const payload = {
      id: newUser.account_id,
      role: newUser.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '3600s' }); // Expires in 1 hour
    
    return res.status(201).json({ message: "User created successfully", user: newUser, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
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
