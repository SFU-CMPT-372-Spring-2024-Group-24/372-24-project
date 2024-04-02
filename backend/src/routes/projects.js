// Models
const { Project, User } = require("../db");
// Node modules
const path = require("path");
const fs = require("fs");
// Third-party modules
const express = require("express");
const Sequelize = require("sequelize");
const multer = require("multer");
const { Storage } = require('@google-cloud/storage');

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
      order: [[Sequelize.literal('"UserProject"."createdAt"'), 'ASC']],
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

    for (let userId of userIds) {
      const user = await User.findByPk(userId);
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

// Cloud storage
const cloudStorage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = cloudStorage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
const upload = multer({ storage: multer.memoryStorage() });

// Add file to project
router.post("/:id/files", upload.single('file'), async (req, res) => {
  const projectId = req.params.id;
  const filename = req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', err => {
    console.error('Error uploading file to Google Cloud Storage:', err);
    res.status(500).json({ message: 'Error uploading file to Google Cloud Storage' });
  });

  blobStream.on('finish', async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    try {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const name = req.file.originalname;
      const url = publicUrl;
      const type = path.extname(name).slice(1);

      const file = await project.createFile({
        name,
        url,
        type
      });

      res.status(201).json(file);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  blobStream.end(req.file.buffer);
});

// Get files by project id
router.get("/:id/files", async (req, res) => {
  const projectId = req.params.id;

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
router.delete("/:id/files/:fileId", async (req, res) => {
  const projectId = req.params.id;
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
