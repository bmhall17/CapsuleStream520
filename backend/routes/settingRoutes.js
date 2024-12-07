const express = require('express');
const {
    getSettings, 
    updateUsername, 
    updatePassword, 
    updateNotifications, 
    deleteAccount,
} = require('../controllers/settingController');
const authMiddleware = require('../middleware/authMiddleware'); // Import authentication middleware

const router = express.Router();

// Route for fetching user settings
router.get('/settings', authMiddleware, getSettings);

// Route for updating username
router.put('/settings/username', authMiddleware, updateUsername);

// Route for updating password
router.put('/settings/password', authMiddleware, updatePassword);

// Route for updating notification preferences
router.put('/settings/notifications', authMiddleware, updateNotifications);

// Route for deleting the account
router.delete('/settings', authMiddleware, deleteAccount);

// Export the router object
module.exports = router;