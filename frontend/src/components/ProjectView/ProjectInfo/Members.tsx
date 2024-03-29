// Libraries
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
// Icons
import { IoMdAdd } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// Models
import { Project } from "../../../models/Project";
import { User } from "../../../models/User";
// API
import { api } from "../../../api";

interface Props {
  project: Project;
  // setProject: (project: Project) => void;
  members: User[];
  setMembers: (members: User[]) => void;
}

const Members = ({ project, members, setMembers }: Props) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const openAddMemberModal = () => setShowAddMemberModal(true);
  const closeAddMemberModal = () => {
    setShowAddMemberModal(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUsers([]);
  };

  const handleAddMembers = async () => {
    try {
      const response = await api.post(`/projects/${project.id}/addUsers`, {
        userIds: selectedUsers.map((user) => user.id),
      });

      setMembers(response.data.Users);
      closeAddMemberModal();
    } catch (error) {
      console.error("Failed to add member: ", error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userIds = members.map((user) => user.id);
      const response = await api.get(
        `/users/search?query=${searchQuery}&exclude=${JSON.stringify(userIds)}`
      );
      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Failed to search for users: ", error);
    }
  };

  const handleSelectUser = (user: User) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
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
            <IoMdAdd size={20} />
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
        dialogClassName="add-member-modal"
        backdropClassName="add-member-modal-backdrop"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a member</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="search-member" onSubmit={handleSearch}>
            <div className="search-bar">
              <IoSearch size={18} className="search-icon" />
              <input
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

                {selectedUsers.includes(user) ? (
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Members;
