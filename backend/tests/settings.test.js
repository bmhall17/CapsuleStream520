const request = require('supertest');
const {app, server} = require('../server'); // Assuming your Express app is exported from this file
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './.env.test' }); // Load .env.test for testing

describe('Settings Routes', () => {
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
  
      // Mock data
      const mockUser = {
      username: 'adventurer123',
      email: 'testuser@example.com',
      password: 'password123',
      notificationsEnabled: false,
      };      
  
    describe('get /api/settings', () => {
        it('should return the user settings', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const res = await request(app)
            .get('/api/settings')
            .send(user)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.notificationsEnabled).toBe(mockUser.notificationsEnabled);
        });
    });

    describe('put /api/settings/username', () => {
        it('should update the username', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const newUsername = 'newUsername';
        const res = await request(app)
            .put('/api/settings/username')
            .send({ username: newUsername })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Username updated successfully.');
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.username).toBe(newUsername);
        expect(updatedUser.password).toBe(user.password);
        });
    });

    describe('put /api/settings/password', () => {
        it('should update the password', async () => {
        mockUser.password = await bcrypt.hash(mockUser.password, 10);
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const updatedPassword = 'newPassword';
        const res = await request(app)
            .put('/api/settings/password')
            .send({ oldPassword: 'password123', newPassword: updatedPassword })
            .set('Authorization', `Bearer ${token}`);
        console.log(res.body.message);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Password updated successfully.');
        const updatedUser = await User.findById(user._id);
        const isPasswordCorrect = await bcrypt.compare(updatedPassword, updatedUser.password);
        expect(isPasswordCorrect).toBe(true);
        expect(updatedUser.username).toBe(user.username);
        });
    });

    describe('put /api/settings/notifications', () => {
        it('should update notification preference', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const res = await request(app)
            .put('/api/settings/notifications')
            .send({ notificationsEnabled: true })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Notification preferences updated.');
        const updatedUser = await User.findById(user._id);
        expect(updatedUser.notificationsEnabled).toBe(true);
        });
    });

    describe('delete /api/settings', () => {
        it('should delete the account', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const res = await request(app)
            .delete('/api/settings')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Account deleted successfully.');
        const updatedUser = await User.findById(user._id);
        expect(updatedUser).toBe(null);
        });
    });
 });