const { Task, User, File } = require('../db');
const express = require('express');

const router = express.Router();

// Get tasks by list id
router.get('/:listId', async (req, res) => {
    const listId = req.params.listId;

    try {
        const tasks = await Task.findAll({
            where: { listId },
            order: [['orderIndex', 'ASC']]
        });

        res.json(tasks);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Create task
router.post('/', async (req, res) => {
    const { name, listId } = req.body;

    try {
        const task = await Task.create({
            name,
            listId
        });

        await task.update({ orderIndex: -task.id });

        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, priority, description, dueDate, isDone } = req.body;
    const fieldsToUpdate = {};

    if (name) {
        fieldsToUpdate.name = name;
    }
    if (priority) {
        fieldsToUpdate.priority = priority;
    }
    if (description !== undefined) {
        fieldsToUpdate.description = description;
    }
    if (dueDate !== undefined) {
        fieldsToUpdate.dueDate = dueDate;
    }
    if (isDone !== undefined) {
        fieldsToUpdate.isDone = isDone;
    }

    try {
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update only the specified fields
        await task.update(fieldsToUpdate);

        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Task.destroy({
            where: {
                id
            }
        });

        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update task order
router.put('/:id/order', async (req, res) => {
    const id = req.params.id;

    const { orderIndex, listId } = req.body;

    try {
        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update the task's listId and orderIndex
        await task.update({ orderIndex, listId });

        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get users by task id
router.get('/:id/users', async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Get users associated with the task, only return the id, name, email, username, and profilePicture
        const users = await task.getUsers({
            attributes: ['id', 'name', 'email', 'username', 'profilePicture']
        });

        res.json(users);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add user to task
router.post('/:id/users', async (req, res) => {
    const taskId = req.params.id;
    const { userId } = req.body;

    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await task.addUser(user);

        // res.json({ message: 'User added to task' });
        res.status(201).json({ message: 'User added to task' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Remove user from task
router.delete('/:id/users/:userId', async (req, res) => {
    const taskId = req.params.id;
    const userId = req.params.userId;

    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await task.removeUser(user);

        // res.json({ message: 'User removed from task' });
        res.status(200).json({ message: 'User removed from task' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get files
router.get('/:id/files', async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const files = await task.getFiles();

        res.json(files);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add file to task
router.post('/:id/files', async (req, res) => {
    const taskId = req.params.id;
    const { fileId } = req.body;
    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        const file = await File.findByPk(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        await task.addFile(file);

        res.status(201).json({ message: 'File added to task' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Remove file from task
router.delete('/:id/files/:fileId', async (req, res) => {
    const taskId = req.params.id;
    const fileId = req.params.fileId;

    try {
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const file = await File.findByPk(fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        await task.removeFile(file);

        res.status(200).json({ message: 'File removed from task' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;