const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");
const authMiddleware = require("../middleware/authMiddleware");

// Send friend request
router.post(
  "/send-request/:targetUserId",
  authMiddleware,
  friendController.sendFriendRequest
);

// Accept friend request
router.post(
  "/accept-request/:requesterId",
  authMiddleware,
  friendController.acceptFriendRequest
);

// Decline friend request
router.post(
  "/decline-request/:requesterId",
  authMiddleware,
  friendController.declineFriendRequest
);

// Route to get friends (accepted requests)
router.get("/accepted-friends/:userId", friendController.getFriends);

// Route to get friend requests (sent requests with 'sent' status)
router.get("/friend-requests/:userId", friendController.getFriendRequests);

module.exports = router;
