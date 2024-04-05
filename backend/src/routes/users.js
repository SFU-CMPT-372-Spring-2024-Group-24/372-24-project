const { User } = require("../db");
const express = require("express");
const router = express.Router();
const validator = require("validator");
const Sequelize = require("sequelize");
// Utility functions
const { validateName, validateUsername, validateEmail, validatePassword, hashPassword, comparePassword } = require("../utils/userUtils");
const { uploadToGCS } = require("../utils/uploadToGCS");
const validateImage = require("../middleware/validateImage");
// Third-party middleware
const multer = require("multer");

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

  const transaction = await User.sequelize.transaction();

  // Convert to lowercase
  username = username.toLowerCase();
  email = email.toLowerCase();

  try {
    // Validate name
    validateName(name);
    // Validate and check if username exists
    await validateUsername(username);
    // Validate and check if email exists
    await validateEmail(email);
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

    await transaction.commit();
    return res.json({ user: userJSON });
  } catch (err) {
    await transaction.rollback();
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
    return res.status(400).json({ message: "Invalid email/username or password" });
  }

  try {
    // Find user
    const user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid email/username or password" });
    }

    // Compare password
    if (!(await comparePassword(password, user.password))) {
      return res.status(400).json({ message: "Invalid email/username or password" });
    }

    req.session.userId = user.id;

    const userJSON = user.toJSON();
    delete userJSON.password;
    delete userJSON.createdAt;
    delete userJSON.updatedAt;

    return res.status(200).json({ user: userJSON });
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

// Update user: name, username, email, password
router.put("/me", async (req, res) => {
  let { name, username, email, oldPassword, newPassword, newPasswordConfirmation } = req.body;

  const transaction = await User.sequelize.transaction();

  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) {
      // Validate name
      validateName(name);

      user.name = name;
    }

    if (username !== undefined) {
      // Convert to lowercase
      username = username.toLowerCase();
      // Validate and check if username exists
      await validateUsername(username);

      user.username = username;
    }

    if (email !== undefined) {
      // Convert to lowercase
      email = email.toLowerCase();
      // Validate and check if email exists
      await validateEmail(email);

      user.email = email;
    }

    if (oldPassword && newPassword && newPasswordConfirmation) {
      // Compare old password
      if (!(await comparePassword(oldPassword, user.password))) {
        return res.status(400).json({ message: "Incorrect password. Please try again." });
      }
      // Validate new password
      validatePassword(newPassword, newPasswordConfirmation);
      // Hash new password
      user.password = await hashPassword(newPassword);
    }

    await user.save();

    // Return user without password, createdAt, updatedAt
    const userJSON = user.toJSON();
    delete userJSON.password;
    delete userJSON.createdAt;
    delete userJSON.updatedAt;

    await transaction.commit();
    return res.json({ user: userJSON });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
});

// Upload profile picture
const upload = multer({ storage: multer.memoryStorage() });

router.post("/me/profile-picture", upload.single("profilePicture"), validateImage, uploadToGCS(async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.publicUrl;
    await user.save();

    // Return user without password, createdAt, updatedAt
    const userJSON = user.toJSON();
    delete userJSON.password;
    delete userJSON.createdAt;
    delete userJSON.updatedAt;
    return res.json({ user: userJSON });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));

// Remove profile picture
router.delete("/me/profile-picture", async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ profilePicture: null });

    res.json({ message: "Profile picture removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by username
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userJSON = user.toJSON();
    delete userJSON.password;
    delete userJSON.updatedAt;

    res.json({ user: userJSON });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
