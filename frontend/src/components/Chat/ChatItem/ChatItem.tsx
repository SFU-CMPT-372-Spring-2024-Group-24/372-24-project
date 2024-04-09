// Hooks
import { useState } from "react";
import { useUser } from "../../../hooks/UserContext";
// Icons and styles
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosArrowDropleft } from "react-icons/io";
import { TbMessage } from "react-icons/tb";
import "./ChatItem.scss";
// Models
import { Chat } from "../../../models/Chat";
// Components
import ChatView from "./ChatView";
import SettingsView from "./SettingsView";

interface Props {
  setShowChatItem: (showChatItem: boolean) => void;
  chat: Chat | null;
  setChat: (chat: Chat) => void;
}

function ChatItem({ setShowChatItem, chat, setChat }: Props) {
  const { user } = useUser();
  if (!chat || !user) {
    return null;
  }

  const [view, setView] = useState<string>("chatView");

  return (
    <>
      <div className="chat-item">
        <div className="chat-item-header">
          {/* Go back to chat list */}
          <button
            id="backButton"
            className="btn-icon"
            onClick={() => setShowChatItem(false)}
          >
            <IoIosArrowDropleft size={20} />
          </button>

          {/* If it's a direct chat, show the other user's name as chat name. Otherwise, leave as it is */}
          <h3>
            {chat.Users.length <= 2
              ? chat.Users[0].id === user.id
                ? chat.Users[1].name
                : chat.Users[0].name
              : chat.name}
          </h3>

          <button
            type="button"
            className={`btn-icon ${view === "chatView" ? "active" : ""}`}
            onClick={() => setView("chatView")}
          >
            <TbMessage size={18} />
          </button>

          <button
            type="button"
            className={`btn-icon ${view === "chatSettings" ? "active" : ""}`}
            onClick={() => setView("chatSettings")}
          >
            <IoSettingsOutline size={18} />
          </button>
        </div>

        {view === "chatView" && <ChatView chat={chat} />}

        {/* Chat Settings */}
        {view === "chatSettings" && (
          <SettingsView chat={chat} setChat={setChat} />
        )}
      </div>
    </>
  );
}

export default ChatItem;
