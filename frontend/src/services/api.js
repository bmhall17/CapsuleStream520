const API_URL = 'http://localhost:5001/api/posts';
const TAGS_API_URL = 'http://localhost:5001/api/tags';
const SETTINGS_API_URL = 'http://localhost:5001/api/settings';
const USERS_API_URL = 'http://localhost:5001/api/users';

const getToken = () => localStorage.getItem('token'); // Get the JWT token from localStorage

// Function to refresh the token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken'); // Get the refresh token from localStorage
  if (!refreshToken) return null; // No refresh token found
  const response = await fetch('http://localhost:5001/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json(); // Store the data
    localStorage.setItem('token', data.token); // Save the new JWT token
    return data.token;
  }
  return null; // Token refresh failed
};

// Fetch all posts (Public route - no authentication needed)
export const fetchPosts = async () => {
  const response = await fetch(API_URL); // Fetch posts
  const posts = await response.json(); // Store posts
  return posts;
};

// Create a new post (Protected route - authentication required)
export const createPost = async (content, image, tags) => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  let response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include JWT token in the Authorization header
    },
    body: JSON.stringify({ content, image, tags }),
  });
  // If token expired, try to refresh it
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content, image, tags }),
    });
  }
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
};

// Update an existing post (Protected route - authentication required)
export const updatePost = async (id, updatedContent) => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  let response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content: updatedContent }),
  });
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content: updatedContent }),
    });
  }
  if (!response.ok) throw new Error('Failed to update post');
  return response.json();
};

// Delete a post (Protected route - authentication required)
export const deletePost = async (id) => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  let response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  // If token expired, try to refresh it
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
  if (!response.ok) throw new Error('Failed to delete post');
  return response.json();
};

// Like a post (Protected route - authentication required)
export const likePost = async (id) => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  let response = await fetch(`${API_URL}/${id}/like`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  // If token expired, try to refresh it
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(`${API_URL}/${id}/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }
  if (!response.ok) throw new Error('Failed to like post');
  return response.json();
};

// Add a comment to a post (Protected route - authentication required)
export const addComment = async (postId, commentContent) => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  let response = await fetch(`${API_URL}/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ text: commentContent }),
  });
  // If token expired, try to refresh it
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(`${API_URL}/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentContent }),
    });
  }
  if (!response.ok) throw new Error('Failed to add comment');
  return response.json();
};

// Fetch all comments for a post (Public route - no authentication needed)
export const fetchComments = async (postId) => {
  const response = await fetch(`${API_URL}/${postId}/comments`); // Fetch comments
  const comments = await response.json(); // Store comments
  return comments;
};

// Fetch popular tags (Public route - no authentication needed)
export const fetchPopularTags = async (limit = 5) => {
  const response = await fetch(`${TAGS_API_URL}/popular?limit=${limit}`); // Fetch popular tags
  if (!response.ok) throw new Error('Failed to fetch top tags');
  return response.json();
};

// Fetch posts for given tag (Public route - no authentication needed)
export const fetchPostsByTag = async (tag) => {
  if (!tag) throw new Error('Tag is required');
  const response = await fetch(`${API_URL}/by-tag?tag=${encodeURIComponent(tag)}`); // Fetch posts by tag
  if (!response.ok) throw new Error('Failed to fetch posts by tag');
  return response.json();
};

// Search the tags (Public route - no authentication needed)
export const searchTags = async (searchQuery = '') => {
  const queryParam = searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : ''; // Prepare the query string
  const response = await fetch(`${TAGS_API_URL}/${queryParam}`); // Search tags
  if (!response.ok) throw new Error('Failed to search tags');
  return response.json();
};

// Fetch user settings (Public route - no authentication needed)
export const getUserSettings = async () => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  let response = await fetch(SETTINGS_API_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  // If token expired, try to refresh it
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(SETTINGS_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
  if (!response.ok) throw new Error('Failed to fetch user settings');
  return response.json();
};

// Update username (Protected route - authentication required)
export const updateUsername = async (newUsername) => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  let response = await fetch(`${SETTINGS_API_URL}/username`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ username: newUsername }),
  });
  // If token expired, try to refresh it
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(`${SETTINGS_API_URL}/username`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ username: newUsername }),
    });
  }
  if (!response.ok) throw new Error('Failed to update username');
  return response.json();
};

// Function to update password (Protected route - authentication required)
export const updatePassword = async (oldPassword, newPassword) => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  let response = await fetch(`${SETTINGS_API_URL}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  // If token expired, try to refresh it
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(`${SETTINGS_API_URL}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }
  if (!response.ok) throw new Error('Failed to update password');
  return response.json();
};

// Function to update notification preferences (Protected route - authentication required)
export const updateNotificationPreferences = async (preferences) => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  console.log('Updating preferences:', preferences); // Debugging line
  let response = await fetch(`${SETTINGS_API_URL}/notifications`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ notificationsEnabled: preferences }),
  });
  // If token expired, try to refresh it
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(`${SETTINGS_API_URL}/notifications`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ notificationsEnabled: preferences }),
    });
  }
  if (!response.ok) throw new Error('Failed to update notification preferences');
  return response.json();
};

// Function to delete user account (Protected route - authentication required)
export const deleteAccount = async () => {
  let token = getToken(); // Get the JWT token
  if (!token) {
    throw new Error('Authentication token not found');
  }
  let response = await fetch(`${SETTINGS_API_URL}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  // If token expired, try to refresh it
  if (response.status === 401) {
    token = await refreshToken();
    if (!token) throw new Error('Session expired, please log in again');
    response = await fetch(`${SETTINGS_API_URL}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
  if (!response.ok) throw new Error('Failed to delete account');
  return response.json();
};

// Fetch posts by a specific user
export const fetchPostsByUser = async (username) => {
  if (!username) throw new Error('Username is required');
  console.log(`Fetching posts for user: ${username}`);
  const response = await fetch(`${API_URL}/by-user?author=${encodeURIComponent(username)}`);
  if (!response.ok) throw new Error('Failed to fetch posts by username');
  return response.json();
};

// Fetch users from posts
export const searchUsers = async (searchQuery = '') => {
  const queryParam = searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : '';
  const response = await fetch(`${USERS_API_URL}/${queryParam}`);
  if (!response.ok) throw new Error('Failed to search tags');
  return response.json();
};



