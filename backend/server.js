const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const settingRoutes = require('./routes/settingRoutes'); // Import setting routes
const bodyParser = require('body-parser'); // Import body-parser to handle large payloads
const authMiddleware = require('./middleware/authMiddleware'); // Middleware to verify JWT token
require('dotenv').config(); // Load environment variables

const app = express(); // Create an Express application
connectDB(); // Connect to MongoDB
app.use(bodyParser.json({ limit: '50mb' })); // Increase the size limit for JSON payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Handle large URL-encoded payloads
// Middleware for CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Only allow frontend running on localhost:3000
  credentials: true, // Allow credentials if needed (cookies, headers, etc.)
};
app.use(cors(corsOptions)); // Enable CORS with the above options
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api', postRoutes); // Protect post routes with JWT authentication
app.use('/api', settingRoutes); // Protect setting routes with JWT authentication
// Start the server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = {app, server}; // Export the server for testing







