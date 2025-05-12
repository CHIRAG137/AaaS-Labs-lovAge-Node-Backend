const User = require("../models/User");

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  const currentUserId = req.userId;
  const targetUserId = req.params.targetUserId;

  if (currentUserId === targetUserId) {
    return res
      .status(400)
      .json({ error: "You can't send a request to yourself." });
  }

  try {
    const sender = await User.findById(currentUserId);
    const receiver = await User.findById(targetUserId);

    if (!receiver) return res.status(404).json({ error: "User not found." });

    const alreadySent = sender.sentRequestsTo.some(
      (req) => req.userId.toString() === targetUserId
    );
    if (alreadySent)
      return res.status(400).json({ error: "Request already sent." });

    sender.sentRequestsTo.push({ userId: targetUserId, status: "sent" });
    receiver.requestsFrom.push({ userId: currentUserId, status: "sent" });

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  const currentUserId = req.userId;
  const requesterId = req.params.requesterId;

  try {
    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!requester) return res.status(404).json({ error: "User not found." });

    // Update current user's requestFrom
    const reqIndex = currentUser.requestsFrom.findIndex(
      (r) => r.userId.toString() === requesterId
    );
    if (reqIndex === -1)
      return res.status(400).json({ error: "No such friend request." });

    currentUser.requestsFrom[reqIndex].status = "accepted";

    // Update requester's sentRequestsTo
    const sentIndex = requester.sentRequestsTo.findIndex(
      (r) => r.userId.toString() === currentUserId
    );
    if (sentIndex !== -1) {
      requester.sentRequestsTo[sentIndex].status = "accepted";
    }

    await currentUser.save();
    await requester.save();

    res.status(200).json({ message: "Friend request accepted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Decline a friend request
exports.declineFriendRequest = async (req, res) => {
  const currentUserId = req.userId;
  const requesterId = req.params.requesterId;

  try {
    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!requester) return res.status(404).json({ error: "User not found." });

    const reqIndex = currentUser.requestsFrom.findIndex(
      (r) => r.userId.toString() === requesterId
    );
    if (reqIndex === -1)
      return res.status(400).json({ error: "No such friend request." });

    currentUser.requestsFrom[reqIndex].status = "declined";

    const sentIndex = requester.sentRequestsTo.findIndex(
      (r) => r.userId.toString() === currentUserId
    );
    if (sentIndex !== -1) {
      requester.sentRequestsTo[sentIndex].status = "declined";
    }

    await currentUser.save();
    await requester.save();

    res.status(200).json({ message: "Friend request declined." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
