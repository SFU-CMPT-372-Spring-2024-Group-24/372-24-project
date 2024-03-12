require('dotenv').config();
const express = require('express');
const { Message, User, Chat, Comment, Project, List, Task, File } = require('./db');

const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Get all users
app.get('/users', async (req, res) => {
    const users = await User.findAll();
    console.log(req)
    res.json(users);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));