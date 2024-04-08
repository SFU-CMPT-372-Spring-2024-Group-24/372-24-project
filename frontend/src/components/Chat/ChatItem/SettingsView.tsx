// Models
import { Chat } from "../../../models/Chat";
import { User } from "../../../models/User";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// API
import { api, AxiosError } from "../../../api";
// Hooks
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
import { useState } from "react";
import { useChats } from "../../../hooks/ChatContext";
// Icons
import { IoMdAdd } from "react-icons/io";
// Components
import ManageChatModal from "../../Modals/ManageChat/ManageChatModal";

interface Props {
  chat: Chat;
  setChat: (chat: Chat) => void;
}

const SettingsView = ({ chat, setChat }: Props) => {
  const { handleApiError } = useApiErrorHandler();
  const [showManageChatModal, setShowManageChatModal] =
    useState<boolean>(false);
  const { socket, chats: globalChats, setChats: setGlobalChats } = useChats();

  // Remove a user from the chat
  const handleRemoveUser = async (user: User) => {
    try {
      await api.delete(`/chats/${chat.id}/users/${user.id}`);
      setChat({
        ...chat,
        Users: chat.Users.filter((u) => u.id !== user.id),
      });
      setGlobalChats(
        globalChats.map((myChat: Chat) => {
          if (myChat.id == chat.id) {
            return {
              ...chat,
              Users: chat.Users.filter((u) => u.id !== user.id),
            };
          }
          return myChat;
        })
      );
      socket.emit("chat_added");
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  return (
    <>
      <section className="settings-view">
        <div className="members">
          <button
            type="button"
            onClick={() => setShowManageChatModal(true)}
            className="btn-text-secondary"
          >
            <IoMdAdd />
            Add Members
          </button>

          <p>Members</p>

          <ul>
            {chat.Users.map((user, index) => (
              <li key={index}>
                <img
                  src={user.profilePicture || defaultProfilePicture}
                  alt="User Avatar"
                />
                <p>{user.username}</p>
                <button type="button" onClick={() => handleRemoveUser(user)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ManageChatModal
        showModal={showManageChatModal}
        setShowModal={setShowManageChatModal}
        action="add-members"
        chat={chat}
        setChat={setChat}
      />
    </>
  );
};

export default SettingsView;
