const { Chat, User, Message } = require("../db");
const express = require("express");
const router = express.Router();
const validator = require("validator");
const Sequelize = require("sequelize");

// Add new chat for user
router.post("/addChat", async (req, res) => {
  const { chatName, userID, otherID } = req.body;
  console.log("ChatName is:", chatName);
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
    //get other user by id
    const other = await User.findByPk(otherID);
    if (!other) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log("hi3");
    //add both to the chat
    console.log(chat);
    await chat?.addUser(user);
    await chat?.addUser(other);
    console.log("hi4");
    //return information
    res.json({ chat, user, other });
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
          chatID: chat.id,
          users: users.map((user) => ({
            id: user.id,
            username: user.username,
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
module.exports = router;
