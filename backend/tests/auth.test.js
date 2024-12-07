const request = require('supertest');
const mongoose = require('mongoose');
const {app, server} = require('../server'); // Import the server
const User = require('../models/User'); // Import User model for database cleanup
require('dotenv').config({ path: './.env.test' }); // Load .env.test for testing

describe('Auth Routes', () => {
  // Setup and Teardown to connect and disconnect to DB
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) { // Check if disconnected
      const url = 'mongodb://localhost:27017/testdb';
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }
  });

  afterEach(async () => {
    // Cleanup - Remove all documents from all collections after each test
    await mongoose.connection.dropDatabase();
    });

  afterAll(async () => {
    // Cleanup - Close MongoDB connection and drop the test database after all tests
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (server) {
        server.close();
      }
  });

  describe('POST /api/auth/signup', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(newUser)
        .expect(201);

      console.log(response.body);

      expect(response.body.message).toBe('User created successfully');

      const userInDb = await User.findOne({ username: newUser.username });
      console.log(userInDb)
      expect(userInDb).not.toBeNull();
      expect(userInDb.username).toBe(newUser.username);
    });

    it('should return 400 if the user already exists', async () => {
      const existingUser = {
        username: 'existinguser',
        password: 'password123',
        email: 'existinguser@example.com'
      };

      // Create the user first
      await request(app).post('/api/auth/signup').send(existingUser).expect(201);

      // Try creating the same user again
      const response = await request(app)
        .post('/api/auth/signup')
        .send(existingUser)
        .expect(400);

      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully log in with valid credentials', async () => {
        const newUser = {
            username: 'testuser',
            password: 'password123',
            email: 'testinguser@example.com'
          };

      await request(app).post('/api/auth/signup').send(newUser).expect(201);

        const userCredentials = {
            username: newUser.username,
            password: newUser.password
        };

      const response = await request(app)
        .post('/api/auth/login')
        .send(userCredentials)
        .expect(200);

      console.log(response.body);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
    });

    it('should return 400 if credentials are invalid', async () => {
      const invalidCredentials = {
        username: 'wronguser',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials)
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
}); 