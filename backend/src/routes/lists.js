const { List } = require('../db');
const express = require('express');

const router = express.Router();

// Get lists by project id
router.get('/:projectId', async (req, res) => {
    const projectId = req.params.projectId;
    
    try {
        const lists = await List.findAll({
            where: {
                projectId
            }
        });

        // Create 3 default lists if there are no lists
        if (lists.length === 0) {
            await List.bulkCreate([
                {
                    name: 'To Do',
                    projectId
                },
                {
                    name: 'In Progress',
                    projectId
                },
                {
                    name: 'Done',
                    projectId
                }
            ]);

            const newLists = await List.findAll({
                where: {
                    projectId
                }
            });

            return res.json(newLists);
        }

        res.json(lists);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;