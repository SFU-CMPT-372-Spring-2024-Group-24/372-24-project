const express = require("express");
const router = express.Router();
const { User } = require("../db");
const Sequelize = require("sequelize");

// Search users
router.get("/users", async (req, res) => {
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