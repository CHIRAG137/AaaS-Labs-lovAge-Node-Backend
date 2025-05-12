const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateUser = require('../middleware/authMiddleware');

// Send message
router.post('/send', authenticateUser, messageController.sendMessage);

// Get messages between two users
router.get('/:userId', authenticateUser, messageController.getMessages);

module.exports = router;
