import React, { useState, useEffect } from 'react';
import { fetchPosts, deletePost, updatePost } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import PostForm from './PostForm';

const PostList = () => {
  const [posts, setPosts] = useState([]); // Initialize posts state
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate = useNavigate(); // Access the navigate function
  // Fetch posts when the component mounts
  useEffect(() => {
    const getPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts(); // Fetch all posts
        if (Array.isArray(fetchedPosts)) {
          setPosts(fetchedPosts); // Update state with fetched posts
        } else {
          console.error('Fetched data is not an array:', fetchedPosts);
          setPosts([]); // Fallback to an empty array if the data isn't in the expected format
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    getPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePost(id); // Call the deletePost function with the post ID
      setPosts(posts.filter(post => post._id !== id)); // Update state to remove deleted post
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  const handleUpdate = async (id, updatedContent) => {
    try {
      const updatedPost = await updatePost(id, updatedContent); // Call the updatePost function
      setPosts(posts.map(post => post._id === id ? updatedPost : post)); // Update state to reflect changes
    } catch (error) {
      console.error('Failed to update post', error);
    }
  };

  const toggleEditMode = (postId) => {
    setEditingPostId(postId === editingPostId ? null : postId); // Toggle the editing mode
  };

  return (
    <div>
      <h2>Home</h2>
      <PostForm setPosts={setPosts} /> {/* Pass setPosts as a prop to PostForm */}

      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul className="post-list-grid"> {/* Apply grid container styles */}
          {Array.isArray(posts) && posts.map((post) => (
            <li key={post._id} className="post-list-card"> {/* Apply card styles */}
              <Link to={`/post/${post._id}`}
              state={{ from: `/` }}>
                {post.image ? (
                  <img
                    src={post.image}
                    alt="Post"
                    className="post-list-image" /* Apply image styles */
                  />
                ) : (
                  <div className="post-list-text-post"> {/* Apply placeholder styles */}
                    <strong>Text Post</strong> {/* Placeholder text for posts without images */}
                  </div>
                )}
              </Link>
              <p>Likes: {post.likes}</p>
              <p>{post.author}'s Post</p>
              {/* Toggle the visibility of the "Delete" and "Update" buttons */}
              {editingPostId === post._id ? (
                <>
                  <button onClick={() => handleDelete(post._id)}>Delete</button>
                  <button
                    onClick={() => {
                      const updatedContent = prompt('Enter new content:');
                      handleUpdate(post._id, updatedContent);
                    }}
                  >
                    Update
                  </button>
                </>
              ) : (
                <button onClick={() => toggleEditMode(post._id)}>Edit</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList; // Export the PostList component





