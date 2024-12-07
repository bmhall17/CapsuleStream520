const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.NODE_ENV === 'test' 
  ? 'mongodb://localhost:27017/testdb'  // Local test database or in-memory
  : process.env.MONGO_URL;  // Production DB URI

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
    });
    console.log(MONGO_URL)
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;



