const express = require('express');
const router = express.Router();
const { User } = require('../db');
const bcrypt = require('bcrypt');
const validator = require('validator');

// Get all users to test database connection
router.get('/', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// Sign up
router.post('/signup', async (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    // Check if email is already used
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already used' });
    }
    
    // Validate password
    if (password !== passwordConfirmation) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        // Create user
        const user = await User.create({ name, email, password: hash });
        req.session.user = user;
        res.json(user);
    });
});

// Log in
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!result) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        req.session.user = user;
        res.json(user);
    });
});

// Log out
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error: unable to log out' });
        }
        res.clearCookie('cmpt372project.sid');
        res.json({ message: 'Logged out' });
    });
});

module.exports = router;