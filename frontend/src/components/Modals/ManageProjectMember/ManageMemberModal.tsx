// Libraries
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
// Hooks
import { useState } from "react";
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
import useSearchUsers from "../../../hooks/useSearchUsers";
import { useUser } from "../../../hooks/UserContext";
import { useChats } from "../../../hooks/ChatContext";
// Models
import { User } from "../../../models/User";
import { Role, Roles } from "../../../models/ProjectRole";
import { Chat } from "../../../models/Chat";
// API
import { api, AxiosError } from "../../../api";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// Icons and styles
import { IoSearch } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import "./ManageMemberModal.scss";
// Components
import ChangeMemberRoleModal from "../ChangeMemberRole/ChangeMemberRoleModal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const ManageMemberModal = ({ showModal, setShowModal }: Props) => {
  // Task context
  const {
    projectMembers,
    setProjectMembers,
    userRole,
    project,
    userCanPerform,
  } = useTasks();
  // User context
  const { user } = useUser();
  // Chat context
  const { socket, chats, setChats } = useChats();
  // Change member role modal
  const [showChangeRoleModal, setShowChangeRoleModal] =
    useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  // Error handling
  const { handleApiError } = useApiErrorHandler();
  // Search users
  const {
    query,
    setQuery,
    results,
    setResults,
    selectedUsers,
    setSelectedUsers,
    searched,
    setSearched,
    handleSearch,
    handleSelect,
  } = useSearchUsers();
  const excludeIds = projectMembers.map((user) => user.id);
  // Confirmation modal for removing a user
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  // Reset search
  const resetSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedUsers([]);
    setSearched(false);
  };

  // Close modal
  const closeModal = () => {
    resetSearch();
    setShowModal(false);
  };

  // Add members to project, new members will be as role "Viewer"
  const handleAddMembers = async () => {
    try {
      const response = await api.post(`/projects/${project.id}/users`, {
        userIds: selectedUsers.map((user) => user.id),
      });

      if (response.status === 201) {
        console.log("Response:", response);
        const newMembers = selectedUsers.map((user) => {
          return {
            ...user,
            role: Roles.find((role) => role.name === "Viewer") as Role,
          };
        });
        socket.emit("chat_added");
        setProjectMembers([...projectMembers, ...newMembers]);
        //return the chatID from the response, find the certain chatID, add the user to the list
        setChats(
          chats.map((chat: Chat) => {
            if (chat.id === response.data.id) {
              return { ...chat, Users: [...projectMembers, ...newMembers] };
            }
            return chat;
          })
        );

        resetSearch();
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Remove user from project
  const handleRemoveUser = async (user: User) => {
    try {
      const response = await api.delete(
        `/projects/${project.id}/users/${user.id}`
      );

      setProjectMembers(
        projectMembers.filter((member) => member.id !== user.id)
      );

      //get chat id from api response, find the correct chat, and adjust the memebers
      setChats(
        chats.map((chat: Chat) => {
          if (chat.id === response.data.id) {
            console.log("found it!");
            return {
              ...chat,
              Users: projectMembers.filter((member) => member.id !== user.id),
            };
          }
          return chat;
        })
      );
      //tell other users to refresh their chat list
      socket.emit("chat_added");
    } catch (error) {
      handleApiError(error as AxiosError);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  // Open change role modal
  const openChangeRoleModal = (member: User) => {
    if (!userCanPerform("manageMembers")) {
      return;
    }

    setSelectedMember(member);
    setShowChangeRoleModal(true);
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={closeModal}
        dialogClassName="manage-member-modal"
        backdropClassName="manage-member-modal-backdrop"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Your project members</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Add members */}
          {userCanPerform("manageMembers") && (
            <section className="search-section">
              <div>
                <h5>Add members to your project</h5>
                <form
                  className="search-member"
                  onSubmit={(e) => handleSearch(e, excludeIds)}
                >
                  <div className="search-bar">
                    <IoSearch size={18} className="search-icon" />
                    <input
                      autoFocus
                      name="search"
                      id="search"
                      type="text"
                      placeholder="Search by name, username or email"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                    />
                  </div>

                  <button className="btn-text">Search</button>
                </form>

                <ul className="members-list">
                  {searched && !results.length && (
                    <li className="no-member-found">User not found</li>
                  )}

                  {results.map((user) => (
                    <li
                      className="member"
                      key={user.id}
                      onClick={() => {
                        handleSelect(user);
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

                      {selectedUsers.some(
                        (selected) => selected.id === user.id
                      ) ? (
                        <FaCheck size={16} color="#8C54FB" className="icon" />
                      ) : (
                        <IoMdAdd size={20} className="icon" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-text"
                  onClick={handleAddMembers}
                >
                  Add members
                </button>
              </div>
            </section>
          )}

          {/* Current members */}
          <section>
            <h5>Current members</h5>
            <ul className="members-list current">
              {/* Current logged-in user */}
              <li className="member loggedIn-user">
                <img
                  src={user!.profilePicture || defaultProfilePicture}
                  alt="User Avatar"
                />

                <div className="member-info">
                  <Link to={`/profile/${user!.username}`}>
                    <p>{user!.name}</p>
                    <p>{user!.username}</p>
                  </Link>
                </div>

                <div
                  className={`member-role ${
                    userCanPerform("manageMembers") ? "clickable" : ""
                  }`}
                  onClick={() =>
                    openChangeRoleModal({ ...user!, role: userRole } as User)
                  }
                >
                  {userRole.name}
                </div>

                <p className="you">You</p>
              </li>

              {/* Other project members */}
              {projectMembers.map((member) => {
                if (member.id !== user!.id) {
                  return (
                    <li className="member" key={member.id}>
                      <img
                        src={member.profilePicture || defaultProfilePicture}
                        alt="User Avatar"
                      />

                      <div className="member-info">
                        <Link to={`/profile/${member.username}`}>
                          <p>{member.name}</p>
                          <p>{member.username}</p>
                        </Link>
                      </div>

                      <div
                        className={`member-role ${
                          userCanPerform("manageMembers") ? "clickable" : ""
                        }`}
                        onClick={() => openChangeRoleModal(member)}
                      >
                        {member.role?.name}
                      </div>

                      {userCanPerform("manageMembers") && (
                        <>
                          <button
                            className="btn-icon btn-remove-user"
                            onClick={() => {
                              setSelectedMember(member);
                              setShowConfirmationModal(true);
                            }}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </li>
                  );
                }
              })}
            </ul>
          </section>
        </Modal.Body>
      </Modal>

      {/* Change member role modal */}
      <ChangeMemberRoleModal
        showModal={showChangeRoleModal}
        setShowModal={setShowChangeRoleModal}
        member={selectedMember!}
      />

      {/* Confirmation modal when removing a member */}
      <ConfirmationModal
        show={showConfirmationModal}
        message={`Are you sure you want to remove ${selectedMember?.name} from the project?`}
        onConfirm={() => handleRemoveUser(selectedMember!)}
        onCancel={() => setShowConfirmationModal(false)}
      />
    </>
  );
};

export default ManageMemberModal;
