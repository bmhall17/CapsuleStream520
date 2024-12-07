import React from 'react';
import { Link } from 'react-router-dom';

const TopPhotosList = ({ posts }) => {
  return (
    <div>
      {posts.length === 0 ? (
        <p style={{ color: 'white' }}>No posts found.</p>
      ) : (
        <ul className="top-photos-list">
          {posts.map((post) => (
            <li key={post._id} className="top-photo-card">
              <Link to={`/post/${post._id}`}
              state={{ from: `top-photos` }}>
                <img
                  src={post.image}
                  alt={`Post by ${post.author}`}
                  className="top-photo-image"
                />
              </Link>
              <p>Likes: {post.likes}</p>
              <p>{post.author}'s Post</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopPhotosList; // Export the TopPhotosList component
