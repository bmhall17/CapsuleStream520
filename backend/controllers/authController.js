const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use environment variable or fallback secret for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'a7d9a8d9d5b7f3494f6a1b9ab1f8b68c2e678c9d0348a39b349ac4f77d2ecbd8';
const JWT_EXPIRES_IN = '1h'; // Set token expiration time

// User Signup Controller
const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ username }); //Check if the user already exists
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12); // Hash the password
    const newUser = new User({ username, password: hashedPassword, email }); // Create a new user
    await newUser.save(); // Save the user to the database
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Login Controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); // Find the user by username
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password); // Compare the passwords
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign(
        { user: { id: user._id, username: user.username } }, // Payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: '1h' } // Expiration time
      );

    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login }; // Export the controller methods


