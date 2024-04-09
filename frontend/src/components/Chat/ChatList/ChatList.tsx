// Styles
import "./ChatList.scss";
// Components
import ChatItem from "../ChatItem/ChatItem";
import ManageChatModal from "../../Modals/ManageChat/ManageChatModal";
// Hooks
import { useUser } from "../../../hooks/UserContext";
import { useState } from "react";
import { useChats } from "../../../hooks/ChatContext";
// Models
import { User } from "../../../models/User";
import { Chat } from "../../../models/Chat";
// API
import { IoMdClose } from "react-icons/io";

const ChatList = () => {
  const { user } = useUser();
  if (!user) return null;

  const { socket, chats } = useChats();

  const [chatVisibility, setChatVisibility] = useState<boolean>(false);
  const [showChatItem, setShowChatItem] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showManageChatModal, setShowManageChatModal] =
    useState<boolean>(false);

  // Handle viewing a chat
  const handleViewChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowChatItem(true);
    socket.emit("join_room", chat.id);
  };

  return (
    <>
      <button
        type="button"
        className="btn-text"
        id="chatButton"
        onClick={() => setChatVisibility(!chatVisibility)}
      >
        Chat
      </button>

      <div className="chatContainer">
        {chatVisibility && (
          <div className="chatWindow">
            <div className="button-group">
              <button
                className="btn-text-secondary"
                onClick={() => setShowManageChatModal(true)}
              >
                Create Chat
              </button>

              <button
                className="btn-icon"
                onClick={() => setChatVisibility(!chatVisibility)}
              >
                <IoMdClose size={20} />
              </button>
            </div>

            {!showChatItem ? (
              <>
                <ul className="chat-list">
                  {chats.map((chat, index) => (
                    <li
                      // className="chat-item"
                      className={
                        chat.Projects.length == 0
                          ? "chat-item"
                          : "chat-item-project"
                      }
                      key={index}
                      onClick={() => handleViewChat(chat)}
                    >
                      <h3>{chat.name}</h3>
                      <div>
                        {chat.Users.map((person: User, userIndex: number) => (
                          <p key={userIndex}> {person.username}</p>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <ChatItem
                setShowChatItem={setShowChatItem}
                chat={selectedChat}
                setChat={setSelectedChat}
              />
            )}
          </div>
        )}
      </div>

      <ManageChatModal
        showModal={showManageChatModal}
        setShowModal={() => setShowManageChatModal(false)}
        action="create-chat"
      />
    </>
  );
};

export default ChatList;
