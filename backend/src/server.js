// Node modules
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Third-party modules
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { Server: SockerIOServer } = require("socket.io");

const app = express();

// Servers
// HTTPS
const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    requestCert: false,
    rejectUnauthorized: false,
};
const httpsPort = process.env.HTTPS_PORT || 8443;
const httpsServer = https.createServer(options, app);
// HTTP (for chatting only)
const httpPort = process.env.HTTP_PORT || 8080;
const httpServer = http.createServer();

app.use(cors());

// Socket.io
const io = new SockerIOServer(httpServer, {
    cors: {
        //which url is making calls to our socket io server
        //where our react application is running
        origin: "http://localhost:3000/",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    // this would be the chat_id instead of room
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for testing)
app.use("/test", express.static(path.join(__dirname, "./test.local")));

// Session
app.use(session({
    name: "cmpt372project.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: true,
        secure: true,
        httpOnly: false,
    },
}));

// Routes
app.get("/test", (req, res) => {
    if (req.session.userId) {
        res.send(`Hello, User ${req.session.userId}!`);
    } else {
        res.send(`Hello, World!`);
    }
});
app.use("/users", require("./routes/users"));
app.use("/projects", require("./routes/projects"));
app.use("/lists", require("./routes/lists"));
app.use("/tasks", require("./routes/tasks"));

httpsServer.listen(httpsPort, () => console.log(`HTTPS server is running on port ${httpsPort}`));
httpServer.listen(httpPort, () => console.log(`HTTP server is running on port ${httpPort}`));