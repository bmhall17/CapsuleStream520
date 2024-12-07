import React, { useState, useEffect } from 'react';
import { getUserSettings, updateNotificationPreferences, updateUsername, updatePassword, deleteAccount } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

const SettingsPage = () => {
  const [username, setUsername] = useState(''); // Initialize username state
  const [oldPassword, setOldPassword] = useState(''); // Initialize old password state
  const [newPassword, setNewPassword] = useState(''); // Initialize new password state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Initialize notifications state
  const navigate = useNavigate(); // Access the navigate function

  useEffect(() => {
    // Fetch current user settings using API
    getUserSettings()
      .then((response) => {
        setUsername(response.username); // Set the username from the response
        setNotificationsEnabled(response.notificationsEnabled); // Set the notifications preference
      })
      .catch((error) => console.error('Error fetching settings:', error));
  }, []);

  const handleUpdateUsername = () => {
    updateUsername(username) // Call the updateUsername function with the new username
      .then(() => alert('Username updated successfully!'))
      .catch((error) => console.error('Error updating username:', error)); 
  };

  const handleUpdatePassword = () => {
    // Check if the old and new passwords are provided
    if (!oldPassword || !newPassword) {
      alert('Please fill in both the old and new password fields.');
      return;
    }
    updatePassword(oldPassword, newPassword) // Call the updatePassword function with the old and new passwords
      .then(() => alert('Password updated successfully!'))
      .catch((error) => console.error('Error updating password:', error));
  };

  const handleToggleNotifications = () => {
    const updatedPreference = !notificationsEnabled; // Toggle the notifications preference
    setNotificationsEnabled(updatedPreference); // Update the UI state
    // Make sure to send the updated preference to the backend
    updateNotificationPreferences(updatedPreference)
      .then(() => alert('Notification preferences updated!'))
      .catch((error) => {
        console.error('Error updating notifications:', error);
        setNotificationsEnabled(notificationsEnabled); // Rollback if there's an error
        alert('Failed to update notification preferences. Please try again.');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect the user to the login page
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      deleteAccount() // Call the deleteAccount function
        .then(() => {
          alert('Account deleted successfully.');
          handleLogout(); // Log out after deleting the account
        })
        .catch((error) => console.error('Error deleting account:', error));
    }
  };

  return (
    <div className="settings-page">
      <h1>Account Settings</h1>
      <button onClick={() => navigate('/')}>Back</button>
      {/* Update Username */}
      <div>
        <label>
        <label style={{ color: 'white' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <button onClick={handleUpdateUsername}>Update Username</button>
      </div>

      {/* Update Password */}
      <div>
        <label>
        <label style={{ color: 'white' }}>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </label>
        <br />
        <label>
        <label style={{ color: 'white' }}>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button onClick={handleUpdatePassword}>Change Password</button>
      </div>

      {/* Notification Preferences */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleToggleNotifications}
          />
          <label style={{ color: 'white' }}>Enable Email Notifications</label>
        </label>
      </div>

      {/* Delete Account */}
      <div>
        <button onClick={handleDeleteAccount} style={{ color: 'red' }}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default SettingsPage; // Export the SettingsPage component

