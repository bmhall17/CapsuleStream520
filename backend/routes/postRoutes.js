const express = require('express');
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getComments,
  addComment,
  getPopularTags,
  searchTags,
  getPostsByTag,
  getTopPosts,
  getPostsByUser,
  searchUsers,
} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware'); // Import authentication middleware

const router = express.Router();

// Public route: Get all posts (No authentication required)
router.get('/posts', getPosts);

// Protected route: Create a new post (Authentication required)
router.post('/posts', authMiddleware, createPost);

// Protected route: Update an existing post (Authentication required)
router.put('/posts/:id', authMiddleware, updatePost);

// Protected route: Delete a post (Authentication required)
router.delete('/posts/:id', authMiddleware, deletePost);

// Protected route: Like a post (Authentication required)
router.put('/posts/:id/like', authMiddleware, likePost);

// Route to add a comment to a post
router.post('/posts/:id/comments', authMiddleware, addComment);

// Route to get all comments for a post
router.get('/posts/:id/comments', authMiddleware, getComments);

// Route to get popular tags
router.get('/tags/popular', getPopularTags);

// Route to search tags
router.get('/tags', searchTags);

// Route to get posts by tag
router.get('/posts/by-tag', getPostsByTag);

// Route to get top posts
router.get('/posts/top', getTopPosts);

// Route to search users
router.get('/users', searchUsers);

// Route to get posts by user
router.get('/posts/by-user', getPostsByUser);

// Export the router object
module.exports = router;

