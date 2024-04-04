const { Chat, User } = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const Sequelize = require("sequelize");
// Utility functions
const { usernameExists, emailExists, validateUsername, validateEmail, validatePassword, hashPassword } = require("../utils/userUtils");

// Get all users to test database connection
router.get("/", async (req, res) => {
  const users = await User.findAll();

  for (let user of users) {
    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
  }

  res.json(users);
});

//google sign in
router.post("/google-login", async (req, res) => {
  try {
    const { given_name, name, email, picture } = req.body;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        name: name,
        password: given_name,
        username: email,
        email: email,
        profilePicture: picture,
      });
    }

    req.session.userId = user.id;

    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

// Sign up
router.post("/signup", async (req, res) => {
  let { name, username, email, password, passwordConfirmation } = req.body;

  // Convert to lowercase
  username = username.toLowerCase();
  email = email.toLowerCase();

  try {
    // Check if username is already used
    await usernameExists(username);
    // Validate username
    validateUsername(username);
    // Check if email is already used
    await emailExists(email);
    // Validate email
    validateEmail(email);
    // Validate password
    validatePassword(password, passwordConfirmation);
    // Hash password
    const hash = await hashPassword(password);

    // Create user
    const user = await User.create({ name, username, email, password: hash });
    req.session.userId = user.id;

    const userJSON = user.toJSON();
    delete userJSON.password;
    delete userJSON.createdAt;
    delete userJSON.updatedAt;

    return res.json({ userId: req.session.userId, user: userJSON });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Log in
router.post("/login", async (req, res) => {
  let { identifier, password } = req.body; // identifier can be either email or username

  // Convert identifier to lowercase
  identifier = identifier.toLowerCase();

  // Validate identifier
  if (!validator.isEmail(identifier) && !validator.isAlphanumeric(identifier)) {
    return res.status(400).json({ message: "Invalid email or username" });
  }

  try {
    // Find user
    const user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email/username or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid email/username or password" });
    }

    req.session.userId = user.id;

    const userJSON = user.toJSON();
    delete userJSON.password;
    delete userJSON.createdAt;
    delete userJSON.updatedAt;

    return res.status(200).json({ loggedIn: true, user: userJSON });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Log out
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error: unable to log out" });
    }
    res.clearCookie("collabhub.sid");
    return res.status(200).json({ loggedOut: true });
  });
});

// Restore current user session
router.get("/me", async (req, res) => {
  if (req.session.userId) {
    const user = await User.findByPk(req.session.userId);
    if (user) {
      const userJSON = user.toJSON();
      delete userJSON.password;
      delete userJSON.createdAt;
      delete userJSON.updatedAt;
      return res.json({ valid: true, user: userJSON });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } else {
    return res.json({ valid: false });
  }
});

//deletes only user
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user: name, username, email, password, profilePicture
router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, username, email, password, passwordConfirmation, profilePicture } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    await user.save();

    const userJSON = user.toJSON();
    delete userJSON.password;
    delete userJSON.createdAt;
    delete userJSON.updatedAt;

    res.json(userJSON);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
