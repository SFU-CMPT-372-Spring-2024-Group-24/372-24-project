// Hooks
import { useState } from "react";
import { useUser } from "../../../hooks/UserContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
// Libraries
import Modal from "react-bootstrap/Modal";
import { Socket } from "socket.io-client";
// Models
import { User } from "../../../models/User";
import { Chat } from "../../../models/Chat";
// API
import { api, AxiosError } from "../../../api";
// Icons and styles
import { IoSearch } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
// Files
import defaultProfilePicture from '../../../assets/default-profile-picture.png';

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  socket: Socket;
  recentChatters: Chat[];
  setRecentChatters: (chats: Chat[]) => void;
}

const CreateChatModal = ({ showModal, setShowModal, socket, recentChatters, setRecentChatters }: Props) => {
  const { user } = useUser();
  const { handleApiError } = useApiErrorHandler();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const closeModal = () => {
    setShowModal(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUsers([]);
    setHasSearched(false);
  };

  // Create a new chat room
  const handleCreateChat = async () => {
    if (!selectedUsers.length) {
      return;
    }

    try {
      const response = await api.post("/chats", {
        name: "",
        userIds: [user!.id, ...selectedUsers.map((user) => user.id)],
      });

      // Update the state
      setRecentChatters([...recentChatters, response.data]);
      
      // Use socket to broadcast to everyone else to refresh their list of chats
      socket.emit("chat_added");

      // Close the modal
      closeModal();
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Search for users
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery) {
      return;
    }

    try {
      const response = await api.get(
        `/search/users?query=${searchQuery}&exclude=${JSON.stringify(user!.id)}`
      );

      if (response.status === 200) {
        setSearchResults(response.data.users);
        setHasSearched(true);
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Select user to add to the chat room
  const handleSelectUser = (user: User) => {
    if (selectedUsers.some((selected) => selected.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Chat</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="search-member" onSubmit={handleSearch}>
            <div className="search-bar">
              <IoSearch size={18} className="search-icon" />
              <input
                autoFocus
                name="search"
                id="search"
                type="text"
                placeholder="Search by name, username or email"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
            </div>

            <button className="btn-text">Search</button>
          </form>

          <ul className="members-list">
            {hasSearched && !searchResults.length && (
              <li className="no-member-found">User not found</li>
            )}

            {searchResults.map((user) => (
              <li
                className="member"
                key={user.id}
                onClick={() => {
                  handleSelectUser(user);
                }}
              >
                <img
                  src={user.profilePicture || defaultProfilePicture}
                  alt="User Avatar"
                />

                <div className="member-info">
                  <p>{user.name}</p>
                  <p>{user.username}</p>
                </div>

                {selectedUsers.some((selected) => selected.id === user.id) ? (
                  <FaCheck size={16} color="#8C54FB" className="icon" />
                ) : (
                  <IoMdAdd size={20} className="icon" />
                )}
              </li>
            ))}
          </ul>
        </Modal.Body>

        <Modal.Footer>
          <div className="button-group">
            <button type="button" className="btn-cancel" onClick={closeModal}>
              Close
            </button>
            <button type="button" className="btn-text" onClick={handleCreateChat}>
              Create chat
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateChatModal;
