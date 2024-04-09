// Hooks
import { useState } from "react";
import { useUser } from "../../../hooks/UserContext";
// import { useChats } from "../../../hooks/ChatContext";
// Icons and styles
import { IoSettingsOutline } from "react-icons/io5";
import { CiChat2 } from "react-icons/ci";
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
      <div className="chat-window">
        <div className="chat-header">
          <button
            id="backButton"
            className="btn btn-primary"
            onClick={() => setShowChatItem(false)}
          >
            GO BACK
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={() => setView("chatView")}
          >
            <CiChat2 size={20} />
          </button>
          <button
            type="button"
            className="chat-edit-button"
            onClick={() => setView("chatSettings")}
          >
            <IoSettingsOutline size={20} />
          </button>
          <p> {chat.name} </p>
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
