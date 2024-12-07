import React, { useState } from 'react';
import { createPost } from '../../services/api'; // Assuming this is your function to call the backend

const PostForm = ({ setPosts }) => {
  const [content, setContent] = useState(''); // Holds the text input for the post
  const [image, setImage] = useState(null); // Holds the image input for the post
  const [tags, setTags] = useState(''); // Holds the tags input
  const [error, setError] = useState('');
  // Handle image upload and convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert the image to Base64 format
      reader.onloadend = () => {
        setImage(reader.result); // Store Base64 string of image
      };
    }
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if content is empty
    if (!content) {
      setError('Post content cannot be empty');
      return;
    }
    try {
      const tagsArray = tags.split(',').map((tag) => tag.trim()); // Split by comma and trim spaces
      const newPost = await createPost(content, image, tagsArray); // Store new post returned by createPost function
      setPosts((prevPosts) => [...prevPosts, newPost]); // Add new post to the existing posts
      // Clear the input fields after successful submission
      setContent('');
      setImage(null);
      setTags('');
      setError(''); // Clear any previous error messages
    } catch (err) {
      console.error('Error creating post:', err);
      setError('An error occurred while creating your post. Please try again.');
    }
  };
  return (
    <div className="post-form">
      <form onSubmit={handleSubmit}>
        <p>Create a New Post</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
        ></textarea>
        
        {/* Image Upload Input */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
        
        {/* Tags Input */}
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Add tags (comma-separated)"
          style={{ width: '24.5%' }}
        />

        {error && <p className="error">{error}</p>}
        <button type="submit" style={{ float: 'right', color: '#200427' }}>Create Post</button>
      </form>
    </div>
  );
};

export default PostForm; // Export the PostForm component





