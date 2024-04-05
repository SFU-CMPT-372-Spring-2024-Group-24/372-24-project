// Models
const { Project, User, Role, UserProject, File } = require("../db");
// Third-party modules
const express = require("express");
const Sequelize = require("sequelize");
const multer = require("multer");
const checkPermission = require('../middleware/checkPermission');
// Utility functions
const { uploadToGCS } = require("../utils/uploadToGCS");

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

    // Get Owner role
    const ownerRole = await Role.findOne({ where: { name: "Owner" } });
    if (!ownerRole) {
      return res.status(500).json({ message: "Role not found" });
    }

    // Add user to project with Owner role
    await project.addUser(user, { through: { roleId: ownerRole.id } });

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
router.get("/:projectId", checkPermission('read'), async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update project by id
router.put("/:projectId", checkPermission('manageProject'), async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;
  const fieldsToUpdate = {};

  if (name) {
    fieldsToUpdate.name = name;
  }
  if (description) {
    fieldsToUpdate.description = description;
  }

  try {
    const project = await Project.findByPk(projectId);

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
router.delete("/:projectId", checkPermission('manageProject'), async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete project
    await project.destroy();

    res.status(200).json({ message: "Project deleted." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get users by project id
router.get("/:projectId/users", async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const users = await project.getUsers({
      attributes: ["id", "name", "username", "email", "profilePicture"],
      joinTableAttributes: [],
      order: [[Sequelize.literal('"UserProject"."createdAt"'), 'ASC']],
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add users to project
router.post("/:projectId/users", checkPermission('manageMembers'), async (req, res) => {
  const { projectId } = req.params;
  const { userIds } = req.body;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find 'Viewer' role
    const viewerRole = await Role.findOne({ where: { name: "Viewer" } });
    if (!viewerRole) {
      return res.status(500).json({ message: "Role not found" });
    }

    for (let userId of userIds) {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await project.addUser(user, { through: { roleId: viewerRole.id } });
    }

    res.status(201).json({ message: "Users added to project" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove user from project
router.delete("/:projectId/users/:userId", checkPermission('manageMembers'), async (req, res) => {
  const { projectId } = req.params;
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

// User leaves project
router.delete("/:projectId/users", async (req, res) => {
  const { projectId } = req.params;
  const userId = req.session.userId;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an Owner
    const userProject = await UserProject.findOne({
      where: {
        ProjectId: projectId,
        UserId: userId,
      },
      include: Role,
    });

    if (userProject.Role.name === "Owner") {
      // Check if there is at least one other Owner
      const otherOwnersCount = await UserProject.count({
        where: {
          ProjectId: projectId,
          roleId: 1, // Owner role
          UserId: { [Sequelize.Op.ne]: userId },// Exclude the current user
        },
      });

      if (otherOwnersCount === 0) {
        return res.status(403).json({ message: "You are the only owner of this project. You cannot leave the project." });
      }
    }

    await project.removeUser(user);

    res.status(200).json({ message: "You have left the project" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Local storage
// const uploadsDir = path.join(__dirname, "../../uploads");
// fs.mkdirSync(uploadsDir, { recursive: true });
// const localStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir)
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   }
// });
// const upload = multer({ storage: localStorage });

// Google Cloud Storage
const upload = multer({ storage: multer.memoryStorage() });
// Add file to GCS if it does not exist, then add file to project
router.post("/:projectId/files", checkPermission('manageFiles'), upload.single("file"), uploadToGCS(async (req, res) => {
  const { projectId } = req.params;
  const { fileId } = req.file;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const file = await File.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    await project.addFile(file);

    res.status(201).json(file);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}));

// Get files by project id
router.get("/:projectId/files", async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const files = await project.getFiles();

    res.json(files);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete file by id
router.delete("/:projectId/files/:fileId", checkPermission('manageFiles'), async (req, res) => {
  const { projectId } = req.params;
  const fileId = req.params.fileId;

  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const file = await project.getFiles({
      where: { id: fileId }
    });
    if (file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    await file[0].destroy();

    res.status(200).json({ message: "File deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
