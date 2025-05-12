const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  const { recipientId, content } = req.body;
  const senderId = req.userId; // Assuming the user's ID is set in the request (via authentication middleware)

  if (!recipientId || !content) {
    return res.status(400).json({ message: 'Recipient and content are required' });
  }

  try {
    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Get all messages between two users
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const senderId = req.userId; // Current logged-in user

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: userId },
        { sender: userId, recipient: senderId },
      ],
    })
      .sort({ timestamp: 1 }) // Sort messages by timestamp
      .populate('sender', 'name image') // Populate sender details if needed
      .populate('recipient', 'name image'); // Populate recipient details if needed

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};
