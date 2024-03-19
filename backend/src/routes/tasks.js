const { Task } = require('../db');
const express = require('express');

const router = express.Router();

// Get tasks by list id
router.get('/:listId', async (req, res) => {
    const listId = req.params.listId;

    try {
        const tasks = await Task.findAll({
            where: {
                listId
            }
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

        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, listId, priority, description, dueDate } = req.body;
    const fieldsToUpdate = {};

    if (name) {
        fieldsToUpdate.name = name;
    }
    if (listId) {
        fieldsToUpdate.listId = listId;
    }
    if (priority) {
        fieldsToUpdate.priority = priority;
    }
    if (description) {
        fieldsToUpdate.description = description;
    }
    if (dueDate) {
        fieldsToUpdate.dueDate = dueDate;
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

module.exports = router;