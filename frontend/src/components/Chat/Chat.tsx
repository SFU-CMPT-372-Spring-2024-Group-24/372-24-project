// import { IoMdChatboxes } from "react-icons/io";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.scss";
import ChatMessages from "./ChatMessages";

const socket = io("http://localhost:3001", {
  secure: false,
  rejectUnauthorized: false,
});

const Chat = () => {
  //   return <IoMdChatboxes size={40} />;
  //somehow get the user_id here
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [chatVisibility, setChatVisibility] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const goBack = () => {
    setShowChat(false);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        id="chatButton"
        onClick={() => setChatVisibility(!chatVisibility)}
      >
        Chat
      </button>
      <div className="chatContainer">
        {chatVisibility && (
          <div className="chatWindow">
            {!showChat ? (
              <>
                <input
                  type="text"
                  placeholder="Your Username"
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
                <input
                  type="text"
                  placeholder="room_id"
                  onChange={(event) => {
                    setRoom(event.target.value);
                  }}
                />
                <button className="btn btn-primary" onClick={joinRoom}>
                  Join Room
                </button>
              </>
            ) : (
              <ChatMessages
                socket={socket}
                username={username}
                room={room}
                goBack={goBack}
              />
            )}
            <button
              className="btn btn-danger"
              onClick={() => setChatVisibility(!chatVisibility)}
            >
              {" "}
              Close Chat{" "}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
