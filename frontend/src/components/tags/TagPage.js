import React, { useState } from 'react';
import TagSelector from './TagSelector';
import TagPostList from './TagPostList';
import { Link, useNavigate } from 'react-router-dom';


const TagPage = () => {
  const [selectedTag, setSelectedTag] = useState(''); // Initialize selectedTag state
  const navigate = useNavigate(); // Access the navigate function

  const goToPostList = () => {
    navigate('/'); // Redirect the user to the main feed
  };

  return (
    <div>
      <h1>Explore by Tag</h1>
      <button onClick={goToPostList}>Return to Feed</button>
      <TagSelector onSelectTag={setSelectedTag} />
      <TagPostList selectedTag={selectedTag} />
    </div>
  );
};

export default TagPage; // Export the TagPage component
