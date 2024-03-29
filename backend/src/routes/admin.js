const { Project } = require("../db");
const express = require("express");

const router = express.Router();

// Get all projects 
router.get("/", async (res) => {
    try {
        const project = await Project.findAll();

        res.json(project);
    } catch (error) {
        res.statusCode(400).json({ message: error.message });
    }
    
});

module.exports = router;