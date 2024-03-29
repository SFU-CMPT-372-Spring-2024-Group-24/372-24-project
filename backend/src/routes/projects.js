const { Project, User } = require("../db");
const express = require("express");

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
        {
          model: User,
          attributes: ["id", "name", "username", "email", "profilePicture"],
          through: { attributes: [] },
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
    const project = await Project.findByPk(id, {
      include: {
        model: User,
        attributes: ["id", "name", "username", "email", "profilePicture"],
        through: { attributes: [] },
      },
    });

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

//Get all projects in the database
router.get("/all", async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add user to project
router.post("/:id/addUsers", async (req, res) => {
  const { id } = req.params;
  const { userIds } = req.body;

  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    for (let userId of userIds) {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      await project.addUser(user);
    }

    const updatedProject = await Project.findByPk(id, {
      include: {
        model: User,
        attributes: ["id", "name", "username", "email", "profilePicture"],
        through: { attributes: [] },
      },
    });

    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
