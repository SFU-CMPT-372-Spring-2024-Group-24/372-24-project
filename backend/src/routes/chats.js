const { Project, Chat, User, Message } = require("../db");
const express = require("express");
const router = express.Router();
const validator = require("validator");
const Sequelize = require("sequelize");

// Add new chat for user
router.post("/", async (req, res) => {
  let { name, userIds } = req.body;
  try {
    // If name is empty, assign the current time as the name
    if (!name) {
      name = new Date().toLocaleString();
    }

    // Create chat
    const chat = await Chat.create({
      name,
    });

    // Add users to chat
    for (let userId of userIds) {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await chat.addUser(user);
    }

    // Return the new chat with id, name, and users
    res.json({
      id: chat.id,
      name: chat.name,
      Users: await chat.getUsers(),
      Projects: await chat.getProjects(),
    });
  } catch (err) {
    console.error("Error adding chat:", err);
    res.status(400).json({ message: "Error adding chat", error: err.message });
  }
});

//create a chat when creating a project
router.post("/addProjectChat", async (req, res) => {
  const { chatName, userID, projectID } = req.body;
  try {
    const chat = await Chat.create({
      name: chatName,
    });

    // get user by id
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //add sending user to the chat
    await chat.addUser(user);

    //get project by id
    const project = await Project.findByPk(projectID);

    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    //add project to the chat

    await project.addChat(chat);

    //return information
    res.json({ chat, user, project });
  } catch (err) {
    console.error("Error adding chat:", err);
    res.status(400).json({ message: "Error adding chat", error: err.message });
  }
});

// Get all chats for a user by user id, including the users in each chat
router.get("/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const chats = await user.getChats({
      include: [
        {
          model: User,
          attributes: ["id", "name", "username", "profilePicture"],
        },
        {
          model: Project,
          attributes: ["id"],
        },
      ],
    });

    res.json(chats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get project chats for a certain userID
router.get("/getProjectChats/:userID", async (req, res) => {
  const { userID } = req.params;

  // const test = User.findAll({
  //   where: { id: userID },
  //   include: [
  //     {
  //       model: Project,
  //       include: [User],
  //     },
  //   ],
  // }).then((users) => {
  //   res.json(users); // Send the chats data as JSON response
  // });

  const test = User.findAll({
    where: { id: userID },
    include: [
      {
        model: Chat,
        include: [
          {
            model: Project,
            include: [User],
          },
        ],
      },
    ],
  }).then((users) => {
    res.json(users); // Extract Chats from each user and flatten the array
  });

  //get projects user is associated with

  //for each project, get the chat that it is associated with it
});

// Add a new message to a chat
router.post("/messages", async (req, res) => {
  const { chatId, message } = req.body;

  try {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const newMessage = await Message.create({
      message,
      chatId,
      userId: req.session.userId,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get all messages for a certain chat
router.get("/messages/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.findAll({
      where: { chatId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "username"],
        },
      ],
      attributes: ["message", "createdAt", "chatId"], // get message and date
    });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//remove user from chat
router.delete("/:chatId/users/:userId", async (req, res) => {
  const chatId = req.params.chatId;
  const userId = req.params.userId;

  try {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await chat.removeUser(user);

    res.status(200).json({ message: "User removed from chat" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//add users to a Chat
router.post("/:chatId/users", async (req, res) => {
  const chatId = req.params.chatId;
  const userIds = req.body.userIds;

  try {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    //add each user to the chat
    for (let userId of userIds) {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await chat.addUser(user);
    }

    res.status(201).json({ message: "Users added to chat" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//rename chat Name
router.post("/:chatId/chatName", async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const chatName = req.body.chatName;

    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    //rename the chat
    await chat.update({ name: chatName });
    res.status(201).json({ message: "Chat Name updated" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
