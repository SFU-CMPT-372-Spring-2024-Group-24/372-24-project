require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const { Message, User, Chat, Comment, Project, List, Task, File } = require('./db');

const port = process.env.PORT || 8080;
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};
const app = express();
const server = https.createServer(options, app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('<h1>Hello, World!</h1>');
    // res.send('Hello, World!');
});

// Get all users to check if database is working
app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

// app.listen(port, () => console.log(`Server is running on port ${port}`));
server.listen(port, () => console.log(`Server is running on port ${port}`));