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
const { Server: SocketIOServer } = require("socket.io");
const { initializeApp } = require("firebase/app");
const { getStorage, ref } = require("firebase/storage");

const app = express();

// CORS
app.use(cors());

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
app.use("/chats", require("./routes/chats"));
app.use("/lists", require("./routes/lists"));
app.use("/tasks", require("./routes/tasks"));

// HTTPS server (for API)
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  requestCert: false,
  rejectUnauthorized: false,
};
const httpsPort = process.env.HTTPS_PORT || 8443;
const httpsServer = https.createServer(options, app);

// HTTP server (for chatting only)
const httpPort = process.env.HTTP_PORT || 8080;
const httpServer = http.createServer();
httpServer.listen(httpPort, () =>
  console.log(`HTTP server is running on port ${httpPort}`)
);

// Chat server
const io = new SocketIOServer(httpServer, {
  cors: {
    //which url is making calls to our socket io server
    //where our react application is running
    origin: "https://cmpt-372-project-backend-e6bh7dyuba-uc.a.run.app/",
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
    socket.to(data).emit("receive_message");
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Firebase cloud storage
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const storageRef = ref(storage, "files");

//Static files of the built react application:
app.use(express.static(path.join(__dirname, "..", "..", "frontend/dist/")));

//send html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "frontend/dist/index.html"));
  console.log("made it to test2!");
});

console.log(
  "path name:",
  path.join(__dirname, "..", "..", "frontend/dist/index.html")
);

httpsServer.listen(httpsPort, () =>
  console.log(`HTTPS server is running on port ${httpsPort}`)
);
