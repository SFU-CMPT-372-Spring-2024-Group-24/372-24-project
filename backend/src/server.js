// Node modules
// const https = require("https");
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
// app.use(cors());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for testing)
app.use("/test", express.static(path.join(__dirname, "./test.local")));

// Still trying to get the session to work to keep user logged in
// Session
app.use(session({
  name: "cmpt372project.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true,
    secure: false,
    httpOnly: true,
  },
}));
// app.use(session({
//     name: "cmpt372project.sid",
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false,
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000
//     },
// }));

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

// HTTP server
const port = process.env.PORT || 8080;
const httpServer = http.createServer(app);
httpServer.listen(port, () => console.log(`HTTP server is running on port ${port}`));

// Chat server
const io = new SocketIOServer(httpServer);
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
