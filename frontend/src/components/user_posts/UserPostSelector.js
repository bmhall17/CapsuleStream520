import React, { useState, useEffect } from 'react';
import { searchUsers } from '../../services/api';

const UserPostSelector = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState(''); // Initialize searchQuery state
  const [filteredUsers, setFilteredUsers] = useState([]); // Initialize filteredUsers state
  const handleSearch = (query) => {
    console.log(`Searching for users with query: ${query}`);
    setSearchQuery(query); // Update the searchQuery state
    if (query) {
      searchUsers(query).then(setFilteredUsers); // Fetch users and update the filteredUsers state
      console.log('Fetched users:', filteredUsers);
    } else {
      console.log('No search query entered, clearing users list');
      setFilteredUsers([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search ..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div>
        {filteredUsers.map((user) => (
          <button key={user} onClick={() => onSelectUser(user)}>
            {user}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserPostSelector; // Export the UserPostSelector component