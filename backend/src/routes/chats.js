const { Chat, User, Message } = require("../db");
const express = require("express");
const router = express.Router();
const validator = require("validator");
const Sequelize = require("sequelize");

// Add new chat for user
router.post("/addChat", async (req, res) => {
  const { chatName, userID, otherIDs } = req.body;
  console.log("otherIDs is:", otherIDs);
  try {
    //make a new Chat
    // const [chat, user, other] = await Promise.all([
    //   Chat.create({ name: chatName }),
    //   User.findByPk(userID),
    //   User.findByPk(otherID),
    // ]);
    const chat = await Chat.create({
      name: chatName,
    });
    console.log("hi1");
    // get user by id
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log("hi2");

    //get all other user by id
    const otherUsers = [];
    otherIDs.forEach(async (otherID) => {
      //get user
      let other = await User.findByPk(otherID);
      if (!other) {
        return res.status(400).json({ message: "User not found" });
      }
      //add user to chat
      await chat.addUser(other);
      otherUsers.push(other);
    });

    console.log("hi3");

    //add sending user to the chat
    await chat?.addUser(user);
    console.log("hi4");
    console.log("Other users:", otherUsers);
    //return information
    res.json({ chat, user, otherUsers });
  } catch (err) {
    console.error("Error adding chat:", err);
    res.status(400).json({ message: "Error adding chat", error: err.message });
  }
});

//get chats for a certain userID
router.get("/getChats/:id", async (req, res) => {
  try {
    const { id } = req.params;

    //get user
    const user = await User.findByPk(id);

    //get chats that the user is associated with
    const chats = await user.getChats();

    // Get chat details along with associated users
    const userChats = await Promise.all(
      chats.map(async (chat) => {
        const users = await chat.getUsers();
        return {
          chatName: chat.name,
          chatID: chat.id,
          users: users.map((user) => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
          })),
        };
      })
    );
    res.json(userChats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//add a new message
router.post("/addMessage", async (req, res) => {
  const { chatID, userID, text, date } = req.body;
  console.log(date);
  try {
    const myMessage = await Message.create({
      chatId: chatID,
      userId: userID,
      message: text,
      date: date,
    });

    //return information
    res.json(myMessage);
  } catch (err) {
    console.error("Error adding message:", err);
    res
      .status(400)
      .json({ message: "Error adding message", error: err.message });
  }
});

//get all messages for a certain chat
router.get("/getMessagesFromChat/:chatID", async (req, res) => {
  try {
    const { chatID } = req.params;

    const messages = await Message.findAll({
      where: { chatId: chatID },
      include: [
        {
          model: User,
          attributes: ["id", "name", "username"],
        },
      ],
      attributes: ["message", "date"], // get message and date
    });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//remove user from chat
router.delete("/:chatID/removeUser/:userID", async (req, res) => {
  const chatID = req.params.chatID;
  const userID = req.params.userID;

  try {
    const chat = await Chat.findByPk(chatID);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await chat.removeUser(user);
    console.log(chat);

    res.status(200).json({ message: "User removed from project" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//add users to a Chat
router.post("/addUsers/:chatID", async (req, res) => {
  const chatID = req.params.chatID;
  console.log("hi");
  console.log("ChatID  is: ", chatID);
  const userIDs = req.body.userIDs;

  console.log(userIDs);

  try {
    const chat = await Chat.findByPk(chatID);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    for (let userID of userIDs) {
      const user = await User.findByPk(userID);
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
module.exports = router;
