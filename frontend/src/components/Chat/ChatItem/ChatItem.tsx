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

  // const addNewMembers = async (event: any) => {
  //   event.preventDefault();
  //   console.log("Adding new Members!");
  //   console.log(currentSelectValue);
  //   // console.log(
  //   //   "mapping:",
  //   //   currentSelectValue.map((user) => JSON.parse(user.value).id)
  //   // );
  //   //console.log(currentSelectValue.map((user) => JSON.parse(user.value).id));
  //   //call api to add users to the chat
  //   if (currentSelectValue.length > 0) {
  //     const response = await api.post(`/chats/addUsers/${chatID}`, {
  //       userIDs: currentSelectValue.map((user) => JSON.parse(user.value).id),
  //     });
  //     //update members to include the values before and also the new users added before the response
  //     if (response.status === 201) {
  //       setMembers([
  //         ...members,
  //         ...currentSelectValue.map((user) => JSON.parse(user.value)),
  //       ]);
  //       setCurrentSelectValue([]);
  //       socket.emit("chat_added");
  //     }
  //   }
  // };
  const chatSettingsCheck = () => {
    if (chat.Projects.length == 0) {
      setView("chatSettings");
    } else {
      alert(
        "Because this is a Project Chat, you need to add/remove members from the Project Page."
      );
    }
  };
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
            onClick={chatSettingsCheck}
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
