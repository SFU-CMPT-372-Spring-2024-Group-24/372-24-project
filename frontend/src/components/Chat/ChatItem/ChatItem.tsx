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
  // const chatSettingsCheck = () => {
  //   if (chat.Projects.length == 0) {
  //     setView("chatSettings");
  //   } else {
  //     alert(
  //       "Because this is a Project Chat, you need to add/remove members from the Project Page."
  //     );
  //   }
  // };
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

          <h3>
            {/*If the chat is a group chat or just has one person, use the chat name.*/}
            {chat.Users.length > 2 || chat.Users.length == 1 ? chat.name : null}
            {/* If it's a direct chat, show the other user's name as chat name. Otherwise, leave as it is */}
            {/* If there's two users in a chat and it is not a project, display the other person's name */}
            {/* Otherwise, display the chat name */}
            {chat.Users.length == 2
              ? chat.Projects.length == 0
                ? chat.Users[0].id === user.id
                  ? chat.Users[1].name
                  : chat.Users[0].name
                : chat.name
              : null}
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
            // onClick={chatSettingsCheck}
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
