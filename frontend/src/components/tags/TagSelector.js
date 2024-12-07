import React, { useState, useEffect } from 'react';
import { fetchPopularTags, searchTags } from '../../services/api';

const TagSelector = ({ onSelectTag }) => {
  const [tags, setTags] = useState([]); // Holds the list of popular tags
  const [searchQuery, setSearchQuery] = useState(''); // Holds the search query
  const [filteredTags, setFilteredTags] = useState([]); // Holds the filtered tags
  useEffect(() => {
    fetchPopularTags().then(setTags); // Fetch popular tags and update state
  }, []);
  const handleSearch = (query) => {
    setSearchQuery(query); // Update the search query state
    if (query) {
      searchTags(query).then(setFilteredTags); // Fetch and update filtered tags
      console.log('Fetched tags:', filteredTags);
    } else {
      setFilteredTags([]);
    }
  };

  const displayTags = searchQuery ? filteredTags : tags; // Display filtered tags if search query is not undefined

  return (
    <div>
      <input
        type="text"
        placeholder="Search tags..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div>
        {displayTags.map((tag) => (
          <button key={tag} onClick={() => onSelectTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSelector; // Export the TagSelector component
