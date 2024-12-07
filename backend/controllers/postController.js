const Post = require('../models/Post');
const User = require('../models/User');
const transporter = require('../config/emailConfig');

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts from the database
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

const createPost = async (req, res) => {
  try {
    console.log('createPost function called');
    const { content, image, tags } = req.body;
    const author = req.user.username; // Assign the author from the request user
    console.log('Received post content:', content);
    console.log('Received post image:', image);
    // Create a new post instance
    const newPost = new Post({
      content,
      author, // Set author from the request user
      image: image || null, // Set image to null if not provided
      likes: 0, // Initialize like count to 0
      tags: tags || [], // Initialize tags to an empty array
    });
    await newPost.save(); // Save the new post to the database
    console.log('Post saved:', newPost);
    const usersWithNotifications = await User.find({ notificationsEnabled: true }); // Find users with notifications enabled
    console.log('Users with notifications:', usersWithNotifications);
    // Send emails to users
    usersWithNotifications.forEach((user) => {
      console.log('Sending email to:', user.email);
      const mailOptions = {
        from: process.env.EMAIL_USER || 'capsulestream520@gmail.com',
        to: user.email,
        subject: 'New Post Created',
        text: `A new post has been created by ${author}, you should check it out!`,
        html: `
          <p>Hi ${user.username},</p>
          <p>${author} just posted something new:</p>
          <blockquote>${content}</blockquote>
          <p>Check it out on CapsuleStream!</p>
        `,
      };
      // Send the email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error(`Error sending email to ${user.email}:`, err);
        } else {
          console.log(`Email sent to ${user.email}:`, info.response);
        }
      });
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const post = await Post.findById(id); // Find the post by ID
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Check if the user is the owner of the post
    if (post.author.toString() !== req.user.username) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true }); // Update the post
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    const post = await Post.findById(id); // Find the post by ID
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Check if the user is the owner of the post
    if (post.author.toString() !== req.user.username) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    await Post.findByIdAndDelete(id); // Delete the post
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const username = req.user.username; // Assign the username from the request user
    const post = await Post.findById(id); // Find the post by ID
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Check if the user has already liked the post
    if (post.likedBy.includes(username)) {
      return res.status(400).json({ message: 'You have already liked this post.' });
    }
    post.likes += 1; // Increment the like count
    post.likedBy.push(username); // Add the user to the likedBy array
    await post.save(); // Save the updated post
    res.status(200).json(post); // Return the updated post with the new like count
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to add a comment to a post
const addComment = async (req, res) => {
  try {
    const { id } = req.params;  // Post ID from the URL parameter
    const {text} = req.body; // Comment text
    const username = req.user.username; // Assuming you're attaching the authenticated user to the request
    const post = await Post.findById(id); // Find the post by ID
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const newComment = {
      username: username,
      text: text,
    }
    post.comments.push(newComment); // Add the new comment to the post
    await post.save(); // Save the updated post
    res.status(200).json({ message: 'Comment added', comments: post.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};


// Function to get all comments for a post
const getComments = async (req, res) => {
  try {
    const { id } = req.params; // Post ID
    // Find the post by its ID and populate comments (if necessary)
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post.comments); // Send back the comments
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get popular tags
const getPopularTags = async (req, res) => {
  try {
    // Aggregate the tags and count the number of occurrences
    const popularTags = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.status(200).json(popularTags.map((tag) => tag._id)); // Send back only the tag names
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch popular tags' });
  }
};

// Function to search tags
const searchTags = async (req, res) => {
  try {
    const query = req.query.query || ''; // Get the query string from the request
    const postsWithTags = await Post.find({ tags: { $regex: query, $options: "i" } }); // Find posts with matching tags
    const allTags = postsWithTags.flatMap(post => post.tags); // Extract all tags from the posts
    // Filter unique tags that match the query string
    const uniqueTags = [...new Set(allTags)].filter(tag =>
      tag.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json(uniqueTags);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Function to get posts by tag
const getPostsByTag = async (req, res) => {
  try {
    const tag = req.query.tag; // Get the tag from the query string
    const posts = await Post.find({ tags: tag }); // Find posts with the specified tag
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Function to get top posts
const getTopPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ likes: -1 }); // Sort posts by likes in descending order
    const topPosts = posts.slice(0, 10); // Filter only posts with images and limit to 10
    res.status(200).json(topPosts); // Send back the top 10 posts
  } catch (error) {
    console.error('Error fetching top posts:', error);
    res.status(500).send('Server Error');
  }
};

// Function to search users
const searchUsers = async (req, res) => {
  try {
    const query = req.query.query || ''; // Get the query string from the request
    const postsWithUsers = await Post.find({ author: { $regex: query, $options: "i" } }); // Find posts with matching authors
    const allUsers = postsWithUsers.map(post => post.author); // Extract all authors from the posts
    // Filter unique authors that match the query string
    const uniqueUsers = [...new Set(allUsers)].filter(author =>
      author.toLowerCase().includes(query.toLowerCase())
    );
    res.status(200).json(uniqueUsers);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Function to get posts by user
const getPostsByUser = async (req, res) => {
  try {
      const username = req.query.author; // Get the author from the query string
      const posts = await Post.find({ author: username }); // Find posts by the specified author
      res.status(200).json(posts)
  } catch (error) {
      res.status(500).json({ message: 'Error fetching posts by user' });
  }
};

// Export the controller methods
module.exports = { getPosts, createPost, updatePost, deletePost, likePost, getComments, addComment, getPopularTags, searchTags, getPostsByTag, getTopPosts, searchUsers, getPostsByUser };



