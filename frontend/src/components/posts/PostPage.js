import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchPosts, likePost, addComment } from '../../services/api';

const PostPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null); // Initialize post state
  const [comments, setComments] = useState([]); // Initialize comments state
  const [newComment, setNewComment] = useState(''); // Track the new comment input
  const [isLiked, setIsLiked] = useState(false); // Track if the post is liked
  const navigate = useNavigate(); // Access the navigate function
  const location = useLocation(); // Access the location object
  const backUrl = location.state?.from || '/';  // Get the previous URL from location state
  // Fetch the post data and comments
  useEffect(() => {
    const getPost = async () => {
      try {
        const fetchedPosts = await fetchPosts(); // Fetch all posts
        const foundPost = fetchedPosts.find((p) => p._id === id); // Find the post by ID
        setPost(foundPost); // Update the post state
        setIsLiked(foundPost.likedBy.includes('User')); // Assuming 'User' is logged in or retrieved from context
        setComments(foundPost.comments); // Update the comments state
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    getPost();
  }, [id]);

  // Handle liking a post
  const handleLike = async () => {
    if (isLiked || !post) return; // Prevent liking if already liked or post is not loaded
    try {
      const updatedPost = await likePost(id); // Like the post
      // Update the state with the new likes count and set liked status
      setPost((prevPost) => ({
        ...prevPost,
        likes: updatedPost.likes,
        likedBy: updatedPost.likedBy,
      }));
      setIsLiked(true); // Update the like status
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  // Handle submitting a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // Don't allow empty comments
    try {
      const updatedPost = await addComment(id, newComment ); // Add the comment to the post
      setComments(updatedPost.comments); // Update the comments state
      setNewComment(''); // Reset the comment input
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (!post) return <p>Loading...</p>; // Show loading message while fetching post

  return (
    <div>
      <button onClick={() => navigate(backUrl)}>Back</button>
      <h2>{post.author}'s Post</h2>
      <p>
      <em style={{ color: 'white' }}>{new Date(post.date).toLocaleString()}</em>
      </p>
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          style={{ width: '300px', height: '300px' }}
        />
      )}
      <p style={{ color: 'white' }}>Likes: {post.likes}</p>
      <button onClick={handleLike} disabled={isLiked}>
        {isLiked ? 'Liked' : 'Like'}
      </button>
      <p style={{ color: 'white', fontSize: '20px' }}>{post.content}</p>
      
      {/* Display tags */}
      {post.tags && post.tags.length > 0 && (
        <div>
          <h3 style={{ color: 'white' }}>Tags:</h3>
          <ul>
            {post.tags.map((tag, index) => (
              <li key={index} style={{ display: 'inline', margin: '0 5px' }}>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Comment Section */}
      <div>
      <h3 style={{ color: 'white' }}>Comments</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            rows="3"
            style={{ width: '100%' }}
          />
          <button type="submit">Post Comment</button>
        </form>

        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index}>
              <p style={{ color: 'white' }}>
                <strong>{comment.username}</strong>: {comment.text}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: 'white' }}>No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default PostPage; // Export the PostPage component


