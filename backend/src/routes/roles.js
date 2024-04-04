// Models
const { Role, UserProject } = require("../db");
// Third-party modules
const express = require("express");
const checkPermission = require('../middleware/checkPermission');

const router = express.Router();

// Get user role of current logged in user for a project
router.get("/:projectId", async (req, res) => {
  const userId = req.session.userId;
  const { projectId } = req.params;

  try {
    const userProject = await UserProject.findOne({
      where: {
        UserId: userId,
        ProjectId: projectId,
      },
      include: Role,
    });

    // Return role of the user in the project
    res.json(userProject.Role);
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user role of all users of a project
router.get("/:projectId/all", async (req, res) => {
  const { projectId } = req.params;

  try {
    const userProjects = await UserProject.findAll({
      where: {
        ProjectId: projectId,
      },
      include: {
        model: Role,
        attributes: ["id", "name"],
      }
    });

    // Return roles of the users in the project
    res.status(200).json(userProjects);
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update user role for a project
// Only Owner can update roles
// If user is the only owner, they cannot be updated
router.put("/:projectId", checkPermission('manageMembers'), async (req, res) => {
  const userId = req.session.userId;
  const { projectId } = req.params;
  const { targetUserId, roleId } = req.body;

  try {
    // If user is trying to update their own role and they are the only owner, return error
    if (userId === targetUserId) {
      const ownersCount = await UserProject.count({
        where: {
          ProjectId: projectId,
        },
        include: {
          model: Role,
          where: {
            name: "Owner",
          },
        },
      });

      if (ownersCount === 1) {
        return res.status(400).json({ message: "The only owner cannot update role"});
      }
    }

    await UserProject.update(
      { roleId },
      {
        where: {
          UserId: targetUserId,
          ProjectId: projectId,
        },
      }
    );

    res.json({ message: "Role updated" });
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;