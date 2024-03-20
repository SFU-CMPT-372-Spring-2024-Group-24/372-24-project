// a lot of code taken from: https://www.youtube.com/watch?v=NU-HfZY3ATQ&t=610s
import ScrollToBottom from "react-scroll-to-bottom";
import React, { useEffect, useState } from "react";
import "./ChatMessages.scss";
import { Socket } from "socket.io-client";
interface Props {
  socket: Socket;
  username: String;
  room: String;
  goBack: () => void;
}

function ChatMessages({ socket, username, room, goBack }: Props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<any[]>([]);
  //insert message into messages table, need chat_id, and user_id, and message_text
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        timeSent:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      console.log("Username is: ", username);
      console.log("Author is: ", messageData.author);
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  //when change in socket server
  useEffect(() => {
    socket.off("receive_message").on("receive_message", (data: any) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);
  return (
    <div>
      <div className="chat-window">
        <div className="chat-header">
          <button id="backButton" className="btn btn-primary" onClick={goBack}>
            GO BACK
          </button>
          <p> Live Chat</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent) => {
              return (
                <div
                  className="message"
                  id={username == messageContent.author ? "other" : "you"}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>{" "}
                    </div>
                    <div className="message-meta">
                      <p id="time">{messageContent.timeSent}</p>
                      <p id="author">{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={currentMessage}
            placeholder="Insert Chat here..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
