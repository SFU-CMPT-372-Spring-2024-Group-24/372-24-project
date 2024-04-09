const express = require("express");
const router = express.Router();
const { User, Project, File, List, Task } = require("../db");
const Sequelize = require("sequelize");

// Search users excluding certain users
router.get("/users/exclude", async (req, res) => {
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

    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search users in project
router.get("/users/project/:projectId", async (req, res) => {
  const { query } = req.query;
  const { projectId } = req.params;
  
  try {
    // Search users in project by name, username, or email
    const users = await User.findAll({
      include: [
        {
          model: Project,
          where: { id: projectId },
          attributes: [],
        },
      ],
      where: {
        [Sequelize.Op.or]: [
          { name: { [Sequelize.Op.iLike]: `%${query}%` } },
          { username: { [Sequelize.Op.iLike]: `%${query}%` } },
          { email: { [Sequelize.Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: ["id", "name", "username", "email", "profilePicture"],
    });
    
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search files in project
router.get("/files/project/:projectId", async (req, res) => {
  const { query } = req.query;
  const { projectId } = req.params;

  try {
    // Search files in project by name
    const files = await File.findAll({
      include: [
        {
          model: Project,
          where: { id: projectId },
          attributes: [],
        },
      ],
      where: {
        name: { [Sequelize.Op.iLike]: `%${query}%` },
      },
      attributes: ["id", "name", "url", "type", "hash"],
    });

    res.status(200).json({ files });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search tasks in project
router.get("/tasks/project/:projectId", async (req, res) => {
  const { query } = req.query;
  const { projectId } = req.params;

  try {
    // Find all lists in the project
    const lists = await List.findAll({
      where: { projectId },
      attributes: ["id"],
    });

    // Extract list IDs
    const listIds = lists.map(list => list.id);

    // Search tasks in lists by name
    const tasks = await Task.findAll({
      where: {
        listId: { [Sequelize.Op.in]: listIds },
        name: { [Sequelize.Op.iLike]: `%${query}%` },
      },
      attributes: ["id", "listId", "name", "priority", "description", "dueDate", "isDone"],
    });

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search users
router.get("/users", async (req, res) => {
  const { query } = req.query;
  
  try {
    // Search users in project by name, username, or email
    const users = await User.findAll({
      where: {
        [Sequelize.Op.or]: [
          { name: { [Sequelize.Op.iLike]: `%${query}%` } },
          { username: { [Sequelize.Op.iLike]: `%${query}%` } },
          { email: { [Sequelize.Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: ["id", "name", "username", "email", "profilePicture"],
    });
    
    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Search my projects 
router.get("/projects/", async (req, res) => {
  const { query } = req.query;
  const userId = req.session.userId;

  try {
    // Search projects by name
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          where: { id: userId },
          attributes: [],
        },
      ],
      where: {
        name: { [Sequelize.Op.iLike]: `%${query}%` },
      },
      attributes: ["id", "name", "description"],
    });

    res.status(200).json({ projects });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

// // Search other projects
// router.get("/projects/other", async (req, res) => {
//   const { query } = req.query;
//   const userId = req.session.userId;

//   try {
//     // Get all project IDs where the current user is a member
//     const userProjects = await User.findByPk(userId, {
//       include: {
//         model: Project,
//         as: 'Projects',
//         attributes: ['id'],
//       },
//     });

//     const userProjectIds = userProjects.Projects.map(project => project.id);

//     // Get all projects excluding those IDs
//     const otherProjects = await Project.findAll({
//       where: {
//         name: { [Sequelize.Op.iLike]: `%${query}%` },
//         id: { [Sequelize.Op.notIn]: userProjectIds },
//       },
//       attributes: ["id", "name", "description"],
//     });

//     res.status(200).json({ projects: otherProjects });
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: err.message });
//   }
// });

module.exports = router;