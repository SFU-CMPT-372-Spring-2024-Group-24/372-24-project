// // import { IoMdChatboxes } from "react-icons/io";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.scss";
import ChatMessages from "./ChatMessages";
import { useUser } from "../../hooks/UserContext";
import { User } from "../../models/User";
import { api } from "../../api";
// Models
import { Chat } from "../../models/Chat";
import CreateChatModal from "../Modals/CreateChat/CreateChatModal";

// const socket = io("wss://collabhub-dot-collabhub-418107.uc.r.appspot.com/");
const socket = io("http://localhost:8080", {
  transports: ["websocket"],
});

const ChatComponent = () => {
  const { user } = useUser();
  const [chatVisibility, setChatVisibility] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [recentChatters, setRecentChatters] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showCreateChatModal, setShowCreateChatModal] = useState<boolean>(false);

  //get chats for a certain ID
  const getRecentChats = async () => {
    try {
      if (user) {
        const response = await api.get(`/chats/${user.id}`);
        setRecentChatters(response.data);
        console.log("Recent Chats:", response.data);
      }
    } catch (error) {
      console.error("Error fetching recent Chats", error);
    }
  };

  useEffect(() => {
    getRecentChats();
    socket.on("refresh_user_list", getRecentChats);
  }, []);

  useEffect(() => {
    //user clicks on whichever chat they want, they will join the room
    if (user?.username && selectedChat) {
      socket.emit("join_room", selectedChat.id);
      setShowChat(true);
    }
  }, [selectedChat?.id]);

  const goBack = () => {
    setShowChat(false);
    setSelectedChat(null);
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
            <button
              className="btn-text-secondary"
              onClick={() => setShowCreateChatModal(true)}
            >
              Create Chat
            </button>

            {!showChat ? (
              <>
                {recentChatters.map((chat, index) => (
                  <div
                    className="recentChatters"
                    key={index}
                    onClick={() => setSelectedChat(chat)}
                  >
                    {chat.name}
                    {chat.Users.map((person: User, userIndex: number) => (
                      <p key={userIndex}> {person.username}</p>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <ChatMessages
                socket={socket}
                goBack={goBack}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
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

      <CreateChatModal
        showModal={showCreateChatModal}
        setShowModal={() => setShowCreateChatModal(false)}
        socket={socket}
        recentChatters={recentChatters}
        setRecentChatters={setRecentChatters}
      />
    </>
  );
};

export default ChatComponent;
