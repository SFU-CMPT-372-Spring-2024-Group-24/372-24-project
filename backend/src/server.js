// Node modules
const https = require("https");
const fs = require("fs");
const path = require("path");

// Third-party modules
require("dotenv").config();
const express = require("express");
const session = require("express-session");

//Chat App Stuff
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

// Server
const port = process.env.PORT || 8080;
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  requestCert: false,
  rejectUnauthorized: false,
};
const app = express();
const server = https.createServer(options, app);

app.use(cors());
const io = new Server(server, {
  cors: {
    //which url is making calls to our socket io server
    //where our react application is running
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  console.log("test");

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
app.use(
  session({
    name: "cmpt372project.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: true,
      secure: true,
      httpOnly: false,
    },
  })
);

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

server.listen(port, () => console.log(`Server is running on port ${port}`));
