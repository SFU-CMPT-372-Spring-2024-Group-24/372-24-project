const { User } = require('../db');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const Sequelize = require('sequelize');

// Get all users to test database connection
router.get('/', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// Sign up
router.post('/signup', async (req, res) => {
    let { name, username, email, password, passwordConfirmation } = req.body;

    // Convert username to lowercase
    username = username.toLowerCase();

    // Validate username
    if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({ message: 'Invalid username' });
    }

    // Check if username is already used
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
        return res.status(400).json({ message: 'Username already used' });
    }

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
        const user = await User.create({ name, username, email, password: hash });
        req.session.user = user;
        res.json(user);
    });
});

// Log in
router.post('/login', async (req, res) => {
    let { identifier, password } = req.body; // identifier can be either email or username

    // Convert identifier to lowercase
    identifier = identifier.toLowerCase();

    // Validate identifier
    if (!validator.isEmail(identifier) && !validator.isAlphanumeric(identifier)) {
        return res.status(400).json({ message: 'Invalid email or username' });
    }

    // Find user
    const user = await User.findOne({ 
        where: { 
            [Sequelize.Op.or]: [
                { email: identifier },
                { username: identifier }
            ] 
        } 
    });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email/username or password' });
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!result) {
            return res.status(400).json({ message: 'Invalid email/username or password' });
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