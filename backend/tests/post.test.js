const request = require('supertest');
const {app, server} = require('../server'); // Assuming your Express app is exported from this file
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
require('dotenv').config({ path: './.env.test' }); // Load .env.test for testing

describe('Post Routes', () => {
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

    const mockPost = {
        content: "Exploring the wonders of the world, one step at a time!",
        author: "adventurer123",
        image: "https://example.com/image.jpg",
        likes: 25,
        likedBy: ["user1", "user2", "user3"],
        tags: ["travel", "adventure", "nature"],
        comments: [
          {
            username: "wanderlust456",
            text: "This is so inspiring! Where is this?",
            createdAt: new Date("2024-12-01T10:30:00Z"),
          },
          {
            username: "globetrotter789",
            text: "I've been there! Such an amazing place.",
            createdAt: new Date("2024-12-02T15:45:00Z"),
          },
        ],
        date: new Date("2024-12-01T09:00:00Z"),
      };
      

    describe('GET /api/posts', () => {
        it('should return all posts', async () => {
        await Post.create(mockPost);
        const res = await request(app).get('/api/posts');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].content).toBe(mockPost.content);
        });
    });

    describe('POST /api/posts', () => {
        it('should create a new post', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const res = await request(app)
            .post('/api/posts')
            .send(mockPost)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.content).toBe(mockPost.content);
        });
    });

    describe('PUT /api/posts/:id', () => {
        it('should update a post', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const post = await Post.create(mockPost);
        const res = await request(app)
            .put(`/api/posts/${post._id}`)
            .send({ content: 'Updated content' })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.content).toBe('Updated content');
        });
    });

    describe('DELETE /api/posts/:id', () => {
        it('should delete a post', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const post = await Post.create(mockPost);
        const res = await request(app)
            .delete(`/api/posts/${post._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Post deleted successfully');
        });
    });

    describe('PUT /api/posts/:id/like', () => {
        it('should like a post', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const post = await Post.create(mockPost);
        const res = await request(app)
            .put(`/api/posts/${post._id}/like`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.likes).toBe(26);
        });
    });

    describe('POST /api/posts/:id/comments', () => {
        it('should add a comment to a post', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const post = await Post.create(mockPost);
        const res = await request(app)
            .post(`/api/posts/${post._id}/comments`)
            .send({ text: 'Nice post!' })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.comments.length).toBe(3);
        expect(res.body.comments[2].text).toBe('Nice post!');
        });
    });

    describe('GET /api/posts/:id/comments', () => {
        it('should return all comments for a post', async () => {
        const user = await User.create(mockUser);
        const token = jwt.sign({ user: { id: user._id, username: user.username } }, process.env.JWT_SECRET);
        const post = await Post.create({
            ...mockPost,
        });
        const res = await request(app).get(`/api/posts/${post._id.toString()}/comments`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body.text).toBe(post.comments.text);
        });
    });

    describe('GET /api/tags/popular', () => {
        it('should return popular tags', async () => {
          await Post.create(mockPost);
          const res = await request(app).get('/api/tags/popular');
          expect(res.status).toBe(200);
          expect(res.body).toEqual(expect.arrayContaining(mockPost.tags));
        });
      });
    
      describe('GET /api/tags', () => {
        it('should return tags matching search criteria', async () => {
          await Post.create(mockPost);
          const res = await request(app).get(`/api/tags/?query=${mockPost.tags[0]}`);
          expect(res.status).toBe(200);
          expect(res.body).toEqual(expect.arrayContaining([mockPost.tags[0]]));
        });
      });
    
      describe('GET /api/posts/by-tag', () => {
        it('should return posts matching a specific tag', async () => {
          const post = await Post.create(mockPost);
          const res = await request(app).get(`/api/posts/by-tag?tag=${mockPost.tags[0]}`);
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(1);
          expect(res.body[0]._id).toBe(post._id.toString());
        });
      });
    
      describe('GET /api/posts/top', () => {
        it('should return top posts based on likes', async () => {
          await Post.create(mockPost);
          const res = await request(app).get('/api/posts/top');
          expect(res.status).toBe(200);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].likes).toBe(25);
        });
      });
    
      describe('GET /api/users', () => {
        it('should return users matching search criteria', async () => {
          const user = await User.create(mockUser);
          const post = await Post.create({ ...mockPost });
          const res = await request(app).get(`/api/users/?query=${user.username}`);
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(1);
          expect(res.body[0]).toBe(post.author);
        });
      });
    
      describe('GET /api/posts/by-user', () => {
        it('should return posts created by a specific user', async () => {
          const user = await User.create(mockUser);
          const post = await Post.create({ ...mockPost });
          const res = await request(app).get(`/api/posts/by-user?author=${user.username}`);
          expect(res.status).toBe(200);
          expect(res.body.length).toBe(1);
          expect(res.body[0]._id).toBe(post._id.toString());
        });
      });
});
