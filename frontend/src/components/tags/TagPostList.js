import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'; // Import Link from react-router-dom
import { fetchPostsByTag } from '../../services/api';

const TagPostList = ({ selectedTag }) => {
  const [posts, setPosts] = useState([]); // Initialize posts state
  // Fetch posts by tag whenever the selectedTag changes
  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag).then(setPosts);
    }
  }, [selectedTag]);

  return (
    <div>
      {posts.length === 0 ? (
        <p style={{ color: 'white' }}>No posts found for this tag.</p>
      ) : (
        <ul className="tag-post-list-grid"> {/* Apply grid container styles */}
          {Array.isArray(posts) &&
            posts.map((post) => (
              <li key={post._id} className="tag-post-list-card"> {/* Apply card styles */}
                <Link to={`/post/${post._id}`}
                 state={{ from: `/tags` }}>
                  {post.image ? (
                    <img
                      src={post.image}
                      alt="Post"
                      className="tag-post-list-image" /* Apply image styles */
                    />
                  ) : (
                    <div className="tag-post-list-text-post"> {/* Apply placeholder styles */}
                      <strong>Text Post</strong> {/* Placeholder text for posts without images */}
                    </div>
                  )}
                </Link>
                {/* Optionally display post content */}
                <p className="tag-post-list-content">{post.content}</p> {/* Apply content styling */}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TagPostList; // Export the TagPostList component



