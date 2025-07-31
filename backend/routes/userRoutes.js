const express = require("express");
const router = express.Router();
const { searchUsers, getUserById } = require("../controllers/userController");

// 🔍 Search users by name/username
router.get("/search", searchUsers);

// 👤 Get user by ID for profile page
router.get("/:id", getUserById);

module.exports = router;
