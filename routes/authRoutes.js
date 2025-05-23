const express = require("express");
const router = express.Router();
const { register, login, getCurrentUser } = require("../controllers/authController");
const authenticateUser = require('../middleware/authMiddleware');

router.post("/register", register);
router.post("/login", login);
router.get('/me', authenticateUser, getCurrentUser);

module.exports = router;
