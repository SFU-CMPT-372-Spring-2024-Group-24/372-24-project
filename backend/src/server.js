// Node modules
const https = require('https');
const fs = require('fs');
const path = require('path');

// Third-party modules
require('dotenv').config();
const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Local modules
const { Message, User, Chat, Comment, Project, List, Task, File } = require('./db');

// Server
const port = process.env.PORT || 8080;
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};
const app = express();
const server = https.createServer(options, app);
const saltRounds = 10; // For bcrypt

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Static files
app.use("/test", express.static(path.join(__dirname, './test.local')),); // http://localhost:8080/test/
// Session
app.use(session({
    name: 'cmpt372project.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.get('/test', (req, res) => {
    res.send('Hello, World!');
});

// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.send(`<h1>Hello, ${req.session.user.name}!</h1>`);
    } else {
        res.send('<h1>Hello, World!</h1>');
    }
});

// Get all users to check if database is working
app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error: unable to log out' });
        }
        res.clearCookie('cmpt372project.sid');
        res.json({ message: 'Logged out' });
    });
});

// app.listen(port, () => console.log(`Server is running on port ${port}`));
server.listen(port, () => console.log(`Server is running on port ${port}`));