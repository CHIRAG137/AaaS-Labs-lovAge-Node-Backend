const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Function to get all users excluding the authenticated user
exports.getAllUsers = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the token and decode it to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key

    // Find all users except the authenticated user
    const users = await User.find({ _id: { $ne: decoded.userId } }); // Exclude the authenticated user by ID

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error, failed to fetch users.' });
  }
};
