import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'; // Import Link from react-router-dom
import { fetchPostsByUser } from '../../services/api';

const UserPostsList = ({ selectedUser }) => {
    const [posts, setPosts] = useState([]); // Initialize posts state
    useEffect(() => {
      if (selectedUser) {
        console.log(`Fetching posts for user: ${selectedUser}`);
        // Fetch posts by the selected user
        fetchPostsByUser(selectedUser).then((fetchedPosts) => {
          console.log('Found posts:', fetchedPosts);
          setPosts(fetchedPosts); // Update the posts state
        });
      }
    }, [selectedUser]);

    return (
        <div>
          {posts.length === 0 ? (
            <p style={{ color: 'white' }}>No posts found for this user.</p>
          ) : (
            <ul className="user-posts-grid">
              {posts.map((post) => (
                <li key={post._id} className="user-post-card">
                  <Link to={`/post/${post._id}`} state={{ from: '/users' }}>
                    {post.image ? (
                      <img
                        src={post.image}
                        alt="Post"
                        className="user-post-image"
                      />
                    ) : (
                      <div className="user-post-text-placeholder">
                        <strong>Text Post</strong>
                      </div>
                    )}
                  </Link>
                  <p className="user-post-content">{post.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };

export default UserPostsList; // Export the UserPostsList component