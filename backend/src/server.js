// Node modules
const https = require('https');
const fs = require('fs');
const path = require('path');

// Third-party modules
require('dotenv').config();
const express = require('express');
const session = require('express-session');

// Server
const port = process.env.PORT || 8080;
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};
const app = express();
const server = https.createServer(options, app);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for testing)
app.use("/test", express.static(path.join(__dirname, './test.local')),);

// Session
app.use(session({
    name: 'cmpt372project.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Routes
app.get('/test', (req, res) => {
    if (req.session.userId) {
        res.send(`Hello, User ${req.session.userId}!`);
    } else {
        res.send(`Hello, World!`);
    }
});
app.use('/users', require('./routes/users'));

server.listen(port, () => console.log(`Server is running on port ${port}`));