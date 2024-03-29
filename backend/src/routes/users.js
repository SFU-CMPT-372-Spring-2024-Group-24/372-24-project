const { Chat, User } = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const Sequelize = require("sequelize");

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

  // Validate username
  if (!validator.isAlphanumeric(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  // Validate password
  if (password !== passwordConfirmation) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if username is already used
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already used" });
    }

    // Check if email is already used
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already used" });
    }

    // Hash password
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({ name, username, email, password: hash });
    req.session.userId = user.id;

    const userJSON = user.toJSON();
    delete userJSON.password;
    delete userJSON.createdAt;
    delete userJSON.updatedAt;

    // res.json(userJSON);
    return res.json({ loggedIn: true, userId: req.session.userId, user: userJSON });
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

    // res.json(userJSON);
    return res.status(200).json({ loggedIn: true, userId: req.session.userId, user: userJSON });
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
    return res.json({ message: "Logged out" });
  });
});

// Check if user is authenticated
// const isAuthenticated = (req, res, next) => {
//   // if (req.session.user.id) {
//   if (req.session.userId) {
//     return next();
//   } else {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

// Restore current user session
// router.get("/me", isAuthenticated, async (req, res) => {
//   // const user = await User.findByPk(req.session.user.id);
//   const user = await User.findByPk(req.session.userId);
//   if (user) {
//     const userJSON = user.toJSON();
//     delete userJSON.password;
//     delete userJSON.createdAt;
//     delete userJSON.updatedAt;
//     res.json(userJSON);
//   } else {
//     res.status(404).json({ message: "User not found" });
//   }
// });

router.get("/me", async (req, res) => {
  if (req.session.userId) {
    const user = await User.findByPk(req.session.userId);
    if (user) {
      const userJSON = user.toJSON();
      delete userJSON.password;
      delete userJSON.createdAt;
      delete userJSON.updatedAt;
      return res.json({ valid: true, user: userJSON, userId: req.session.userId });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } else {
    return res.json({ valid: false });
  }
});

// Search users
router.get("/search", async (req, res) => {
  const { query, exclude } = req.query;

  // Convert exclude to array of excluded user ids
  const excludeIds = JSON.parse(exclude);

  try {
    // Search users by name, username, or email, excluding specified user ids
    const users = await User.findAll({
      where: {
        [Sequelize.Op.and]: [
          {
            [Sequelize.Op.or]: [
              { name: { [Sequelize.Op.iLike]: `%${query}%` } },
              { username: { [Sequelize.Op.iLike]: `%${query}%` } },
              { email: { [Sequelize.Op.iLike]: `%${query}%` } },
            ],
          },
          {
            id: {
              [Sequelize.Op.notIn]: excludeIds,
            },
          },
        ],
      },
      attributes: ["id", "name", "username", "email", "profilePicture"],
    });

    res.json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
