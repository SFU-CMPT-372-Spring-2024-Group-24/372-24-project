const { Project, User } = require("../db");
const express = require("express");
const Sequelize = require("sequelize");

const router = express.Router();

// Add new project for user
router.post("/", async (req, res) => {
  const { name, description, userId } = req.body;

  try {
    // Create project
    const project = await Project.create({
      name,
      description,
    });

    // Add user to project
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    await project.addUser(user);

    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all projects for user
router.get("/", async (req, res) => {
  const { userId } = req.query;

  try {
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
        },
      ],
    });

    res.json(projects);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get project by id
// Todo: check if user is part of project
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update project by id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const fieldsToUpdate = {};

  if (name) {
    fieldsToUpdate.name = name;
  }
  if (description) {
    fieldsToUpdate.description = description;
  }

  try {
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update only the specified fields
    await project.update(fieldsToUpdate);

    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete project by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.destroy();

    res.status(200).json({ message: "Project deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get users by project id
router.get("/:id/users", async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const users = await project.getUsers({
      attributes: ["id", "name", "username", "email", "profilePicture"],
      joinTableAttributes: [],
      order: [[Sequelize.literal('"UserProject"."createdAt"'), "ASC"]],
    });

    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add users to project
router.post("/:id/users", async (req, res) => {
  const projectId = req.params.id;
  const { userIds } = req.body;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    for (let userID of userIDs) {
      const user = await User.findByPk(userID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await project.addUser(user);
    }

    res.status(201).json({ message: "Users added to project" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove user from project
router.delete("/:id/users/:userId", async (req, res) => {
  const projectId = req.params.id;
  const userId = req.params.userId;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await project.removeUser(user);

    res.status(200).json({ message: "User removed from project" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
