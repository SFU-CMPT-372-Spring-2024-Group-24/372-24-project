const { Comment, Task, User } = require('../db');
const express = require('express');

const router = express.Router();

// Get comments by task id
router.get('/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: Task,
          where: { id: taskId },
          attributes: []
        },
        {
          model: User,
          attributes: ['id', 'name', 'username', 'email', 'profilePicture']
        },
      ],
      attributes: ['id', 'comment', 'createdAt', 'isEdited'],
      order: [['id', 'ASC']]
    });

    res.json(comments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create comment using userId, taskId and comment
// Return the created comment with attributes id, comment, updatedAt and user (id, name, username, email, profilePicture)
router.post('/', async (req, res) => {
  const { userId, taskId, comment } = req.body;

  try {
    const newComment = await Comment.create({
      userId,
      taskId,
      comment
    });

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(400).json({ message: 'Task not found' });
    }
    await task.addComment(newComment);

    const createdComment = await Comment.findOne({
      where: { id: newComment.id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username', 'email', 'profilePicture']
        }
      ],
      attributes: ['id', 'comment', 'createdAt', 'isEdited']
    });

    res.json(createdComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update comment
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { comment } = req.body;

  try {
    await Comment.update({ 
      comment,
      isEdited: true
    }, { where: { id } });

    const updatedComment = await Comment.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'username', 'email', 'profilePicture']
        }
      ],
      attributes: ['id', 'comment', 'createdAt', 'isEdited']
    });

    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete comment
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Comment.destroy({
      where: { id }
    });

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;