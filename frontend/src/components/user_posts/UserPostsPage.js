import React, { useState } from 'react';
import UserPostSelector from './UserPostSelector';
import UserPostsList from './UserPostsList';
import { Link, useNavigate } from 'react-router-dom';


const UserPostsPage = () => {
  const [selectedUser, setSelectedUser] = useState(''); // Initialize selectedUser state
  const navigate = useNavigate(); // Access the navigate function
  // Redirect the user to the main feed
  const goToPostList = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Explore by User</h1>
      <button onClick={goToPostList}>Return to Feed</button>
      <UserPostSelector onSelectUser={setSelectedUser} />
      <UserPostsList selectedUser={selectedUser} />
    </div>
  );
};

export default UserPostsPage; // Export the UserPostsPage component