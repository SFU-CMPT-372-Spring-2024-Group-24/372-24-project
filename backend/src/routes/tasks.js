// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//     const Task = sequelize.define('Task', {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true
//         },
//         listId: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         priority: {
//             type: DataTypes.ENUM('unset', 'planning', 'low', 'medium', 'high', 'urgent'),
//             allowNull: true
//         },
//         description: {
//             type: DataTypes.TEXT,
//             allowNull: true
//         },
//         dueDate: {
//             type: DataTypes.DATE,
//             allowNull: true
//         },
//         isDone: {
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             defaultValue: false
//         },
//         orderIndex: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             defaultValue: 0
//         }
//     });

//     return Task;
// }

const { Task } = require('../db');
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
    const { name, listId, priority, description, dueDate, isDone } = req.body;
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
    if (dueDate) {
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

module.exports = router;