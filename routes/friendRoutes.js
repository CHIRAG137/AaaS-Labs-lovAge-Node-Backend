const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

// Send friend request
router.post('/send-request/:targetUserId', authMiddleware, friendController.sendFriendRequest);

// Accept friend request
router.post('/accept-request/:requesterId', authMiddleware, friendController.acceptFriendRequest);

// Decline friend request
router.post('/decline-request/:requesterId', authMiddleware, friendController.declineFriendRequest);

module.exports = router;
