// import { IoMdChatboxes } from "react-icons/io";
import { useState } from "react";
import "./Chat.scss";

const Chat = () => {
  //   return <IoMdChatboxes size={40} />;
  const [chatVisibility, setChatVisibility] = useState(false);
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
          <div className="chatOverlay">
            <h2> Chat</h2>
            <div className="AllChats">
              <h2> List of People: </h2>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => setChatVisibility(!chatVisibility)}
            >
              {" "}
              Close{" "}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
