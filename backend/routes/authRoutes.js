const express = require('express');
const { signup, login } = require('../controllers/authController'); // Import the controller methods
const router = express.Router();

router.post('/signup', signup); // Handle POST requests to /auth/signup

router.post('/login', login); // Handle POST requests to /auth/login

module.exports = router; // Export the router object


