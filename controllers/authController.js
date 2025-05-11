const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerSchema = require("../validation/registerSchema");
const loginSchema = require("../validation/loginSchema");

exports.register = async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = new User({
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      age: Number(validated.age),
      hobbies: validated.hobbies,
      about: validated.about,
      address: validated.address,
      preferredCommunication: validated.preferredCommunication,
    });

    await user.save();

    // Generate JWT token after successful registration
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    // Validate the request body using the login schema
    const validatedData = loginSchema.parse(req.body);

    // Check if the user exists
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(
      validatedData.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Replace with your own secret key
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(400).json({ message: "Validation failed", error: error.errors });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};