const User = require('../models/User');
const bcrypt = require('bcryptjs');
const registerSchema = require('../validation/registerSchema');

exports.register = async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const user = new User({
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      age: Number(validated.age),
      hobbies: validated.hobbies,
      about: validated.about,
      preferredCommunication: validated.preferredCommunication,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    if (err.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
