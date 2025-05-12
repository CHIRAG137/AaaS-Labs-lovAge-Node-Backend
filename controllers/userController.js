const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.getAllUsers = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Authentication required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);

    if (!currentUser)
      return res.status(404).json({ message: "User not found" });

    const users = await User.find({ _id: { $ne: decoded.userId } });

    const enrichedUsers = users.map((user) => {
      const isRequestSent = currentUser.sentRequestsTo?.some(
        (req) => req.userId.toString() === user._id.toString()
      );
      return {
        id: user._id,
        name: user.name,
        age: user.age,
        interests: user.hobbies?.split(",").map((h) => h.trim()) || [],
        requestStatus: isRequestSent ? "sent" : "none",
      };
    });

    res.json(enrichedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, failed to fetch users." });
  }
};
