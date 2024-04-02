// Node modules
const http = require("http");
// const fs = require("fs");
const path = require("path");

// Third-party modules
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { Server: SocketIOServer } = require("socket.io");
// const { initializeApp } = require("firebase/app");
// const { getStorage, ref } = require("firebase/storage");

const app = express();

// CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust the first proxy when running in production on App Engine
app.set("trust proxy", 1);

// Session
app.use(
  session({
    name: "collabhub.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

// Serve React app (for production)
if (process.env.NODE_ENV === "production") {
app.use(express.static(path.join(__dirname, "../dist")));
}

// Static files (for testing)
app.use("/test", express.static(path.join(__dirname, "./test.local")));

// Files
// app.use("/files", express.static(path.join(__dirname, "../uploads")));

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// API user routes (unnecessary to use isAuthenticated middleware because these routes are for authentication)
app.use("/api/users", require("./routes/users"));

// Only allow authenticated users with AJAX requests to access API routes
app.use("/api", isAuthenticated, (req, res, next) => {
  if (req.headers["x-requested-with"] === "XMLHttpRequest") {
    next(); // If the request is an AJAX request, proceed
  } else {
    res.status(403).send("You are not allowed to access this route directly"); // If the request is not an AJAX request, send a 403 Forbidden response
  }
});

// Protected API routes
app.get("/api/test", (req, res) => {
  if (req.session.userId) {
    res.send(`Hello, User ${req.session.userId}!`);
  } else {
    res.send(`Hello, World!`);
  }
});
app.use("/api/search", require("./routes/search"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/chats", require("./routes/chats"));
app.use("/api/lists", require("./routes/lists"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/comments", require("./routes/comments"));

// Catch-all route
if (process.env.NODE_ENV === "production") {
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});
}

// HTTP server
const port = process.env.PORT || 8080;
const httpServer = http.createServer(app);
httpServer.listen(port, () =>
  console.log(`HTTP server is running on port ${port}`)
);

// Chat server
const io = new SocketIOServer(httpServer);
// io.on("connection", (socket) => {
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  // this would be the chat_id instead of room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("chat_added", () => {
    socket.broadcast.emit("refresh_user_list");
  });
  socket.on("send_message", (data) => {
    socket.to(data).emit("receive_message");
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Firebase cloud storage
// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID,
//     measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };
// const firebaseApp = initializeApp(firebaseConfig);
// const storage = getStorage(firebaseApp);
// const storageRef = ref(storage, "files");

// HTTPS server (for API)
// const options = {
//     key: fs.readFileSync(process.env.SSL_KEY_PATH),
//     cert: fs.readFileSync(process.env.SSL_CERT_PATH),
//     requestCert: false,
//     rejectUnauthorized: false,
// };
// const httpsPort = process.env.HTTPS_PORT || 8443;
// const httpsServer = https.createServer(options, app);
// httpsServer.listen(httpsPort, () =>
//     console.log(`HTTPS server is running on port ${httpsPort}`)
// );
