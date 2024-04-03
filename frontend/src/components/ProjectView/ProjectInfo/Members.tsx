// Libraries
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
// Icons
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { IoSearch, IoSettingsOutline } from "react-icons/io5";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// Models
import { Project } from "../../../models/Project";
import { User } from "../../../models/User";
// API
import { api } from "../../../api";
// Custom hooks
import { useUser } from "../../../hooks/UserContext";

interface Props {
  project: Project;
  members: User[];
  setMembers: (members: User[]) => void;
}

const Members = ({ project, members, setMembers }: Props) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { user } = useUser();

  const openAddMemberModal = () => setShowAddMemberModal(true);
  const closeAddMemberModal = () => {
    setShowAddMemberModal(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUsers([]);
    setHasSearched(false);
  };

  const handleAddMembers = async () => {
    try {
      const response = await api.post(`/projects/${project.id}/users`, {
        userIds: selectedUsers.map((user) => user.id),
      });

      if (response.status === 201) {
        setMembers([...members, ...selectedUsers]);
        closeAddMemberModal();
      }
    } catch (error) {
      console.error("Failed to add member: ", error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery) {
      return;
    }

    try {
      const userIds = members.map((user) => user.id);
      const response = await api.get(
        `/search/users?query=${searchQuery}&exclude=${JSON.stringify(userIds)}`
      );

      if (response.status === 200) {
        setSearchResults(response.data.users);
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Failed to search for users: ", error);
    }
  };

  const handleSelectUser = (user: User) => {
    if (selectedUsers.some((selected) => selected.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = async (user: User) => {
    try {
      const response = await api.delete(
        `/projects/${project.id}/users/${user.id}`
      );

      if (response.status === 200) {
        setMembers(members.filter((member) => member.id !== user.id));
      }
    } catch (error) {
      console.error("Failed to remove member: ", error);
    }
  };

  return (
    <>
      <div className="project-members">
        <h2>
          Members
          <button
            type="button"
            className="btn-icon"
            onClick={openAddMemberModal}
          >
            <IoSettingsOutline size={20} />
          </button>
        </h2>

        {members.map((user) => (
          <div className="member" key={user.id}>
            <img
              src={user.profilePicture || defaultProfilePicture}
              alt="User Avatar"
            />
            <p>{user.name}</p>
          </div>
        ))}
      </div>

      <Modal
        show={showAddMemberModal}
        onHide={closeAddMemberModal}
        dialogClassName="manage-member-modal"
        backdropClassName="manage-member-modal-backdrop"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Manage project members</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <section>
            <h5>Current members</h5>
            <ul className="members-list">
              <li className="member loggedIn-user">
                <img
                  src={user!.profilePicture || defaultProfilePicture}
                  alt="User Avatar"
                />

                <div className="member-info">
                  <p>{user!.name}</p>
                  <p>{user!.username}</p>
                </div>

                <p className="you">You</p>
              </li>

              {members.map((member) => {
                if (member.id !== user!.id) {
                  return (
                    <li className="member" key={member.id}>
                      <img
                        src={member.profilePicture || defaultProfilePicture}
                        alt="User Avatar"
                      />

                      <div className="member-info">
                        <p>{member.name}</p>
                        <p>{member.username}</p>
                      </div>

                      <button
                        className="btn-icon btn-remove-user"
                        onClick={() => handleRemoveUser(member)}
                      >
                        Remove
                      </button>
                    </li>
                  );
                }
              })}
            </ul>
          </section>

          <section>
            <div>
              <h5>Add members to your project</h5>
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
                onClick={closeAddMemberModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-text"
                onClick={handleAddMembers}
              >
                Save changes
              </button>
            </div>
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Members;
