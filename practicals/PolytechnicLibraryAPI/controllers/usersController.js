const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/user');

// Create a new user - previous practical
// async function createUser(req, res) {
//   try {
//     const { username, email } = req.body;
//     const newUser = new User(null, username, email);
//     const createdUser = await User.createUser(newUser);
//     res.status(201).json({ message: 'User created successfully', user: createdUser });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ message: 'Error creating user', error: error.message });
//   }
// }

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
}

// Get user by ID
async function getUserById(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await User.getUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
}

// Update user
async function updateUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const { username, email } = req.body;
    const updatedUser = new User(userId, username, email);
    const result = await User.updateUser(userId, updatedUser);
    res.status(200).json({ message: 'User updated successfully', user: result });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    await User.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
}

async function searchUsers(req, res) {
  const searchTerm = req.query.searchTerm; // Extract search term from query params

  try {    
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching users" });
  }
}

async function getUsersWithBooks(req, res) {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
}

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
    // Validate user data
    if (!username || !password || !role) {
      return res.status(400).json({ message: "Please provide username, password, and role" });
    }

    // Check for existing username
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = {
      username,
      passwordHash: hashedPassword,
      role
    };

    const createdUser = await User.createUser(newUser);

    return res.status(201).json({ message: "User created successfully", user: createdUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Validate user credentials
    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "3600s" }); // Expires in 1 hour

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  //createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks,
  registerUser,
  login,
};
