const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get user settings
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Find the user by ID
    res.status(200).json({
      username: user.username,
      notificationsEnabled: user.notificationsEnabled,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

// Update username
const updateUsername = async (req, res) => {
  try {
    const { username } = req.body; // Get the new username from the request body
    const user = await User.findByIdAndUpdate(req.user.id, { username }, { new: true }); // Update the username
    res.status(200).json({ message: 'Username updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating username' });
  }
};

// Update password
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body; // Get the old and new passwords from the request body
        // Validate the passwords (length, complexity, etc.)
        if (!oldPassword || !newPassword) {
          return res.status(400).send({ message: 'Both old and new passwords are required.' });
        }
        const user = await User.findById(req.user.id); // Find the user by ID
        console.log(oldPassword, user.password)
        const passwordMatch = await bcrypt.compare(oldPassword, user.password); // Compare the old password
        console.log(passwordMatch)
        // If the old password doesn't match, return an error
        if (!passwordMatch) {
          return res.status(401).send({ message: 'Incorrect old password.' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword }); // Update the password
        return res.status(200).send({ message: 'Password updated successfully.' });
      } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Internal Server Error' });
      }
    };

// Update notification preferences
const updateNotifications = async (req, res) => {
  try {
    const { notificationsEnabled } = req.body; // Get the new notification preference from the request body
    const user = await User.findByIdAndUpdate(req.user.id, { notificationsEnabled }, { new: true }); // Update the preference
    res.status(200).json({ message: 'Notification preferences updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications.' });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id); // Delete the user account
    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account.' });
  }
};

// Export the controller methods
module.exports = { getSettings, updateUsername, updatePassword, updateNotifications, deleteAccount };