import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../../services/api'; // Assuming you have the API function
import { Link, useNavigate, useLocation } from 'react-router-dom';

const TopPhotosPage = () => {
  const [topPosts, setTopPosts] = useState([]); // Initialize topPosts state
  const navigate = useNavigate(); // Access the navigate function
  const location = useLocation(); // Access the location object
  const backUrl = location.state?.from || '/'; // Get the previous URL from location state, fallback to home feed
  // Fetch posts when the component mounts
  useEffect(() => {
    const getTopPosts = async () => {
      try {
        const posts = await fetchPosts(); // Fetch all posts
        const oneWeekAgo = Date.now() - 24 * 60 * 60 * 1000 * 7; // Calculate one week ago timestamp
        console.log('One week ago:', oneWeekAgo);
        const recentPosts = posts.filter(post => {
          const postDate = new Date(post.date).getTime(); // Convert post date to timestamp
          console.log("Post date:", post.date, "Timestamp:", postDate, "Included:", postDate >= oneWeekAgo); // Log post date and timestamp
          return postDate >= oneWeekAgo; // Filter posts from the past week
        });
        // Sort by likes in descending order
        const sortedPosts = recentPosts 
          .sort((a, b) => b.likes - a.likes) 
          .slice(0, 10); // Get top 10 posts
        setTopPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching top posts:', error);
      }
    };

    getTopPosts();
  }, []);

  return (
    <div>
      <button onClick={() => navigate(backUrl)}>Back</button>
      <h2>Top 10 Posts by Likes in the Past Week</h2>
      {topPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul className="post-list-grid"> {/* Apply grid container styles */}
          {topPosts.map((post) => (
            <li key={post._id} className="post-list-card"> {/* Apply card styles */}
              <Link to={`/post/${post._id}`} state={{ from: `/top-photos` }}>
                {post.image ? (
                  <img
                    src={post.image}
                    alt="Post"
                    className="post-list-image" // Apply image styles
                  />
                ) : (
                  <div className="post-list-text-post"> {/* Apply placeholder styles */}
                    <strong>Text Post</strong> {/* Placeholder text for posts without images */}
                  </div>
                )}
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

export default TopPhotosPage; // Export the TopPhotosPage component

