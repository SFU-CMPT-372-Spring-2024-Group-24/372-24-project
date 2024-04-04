// Libraries
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
// Models
import { Task } from "../../../models/Task";
import { User } from "../../../models/User";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
// Icons
import { IoMdAdd } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
// API
import { api, AxiosError } from "../../../api";

interface Props {
  task: Task;
}

const TaskMembers = ({ task }: Props) => {
  const [assignees, setAssignees] = useState<User[]>([]);
  const { projectMembers, project, userCanPerform } = useTasks();
  const [showAssigneeModal, setShowAssigneeModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>(projectMembers);
  const handleApiError = useApiErrorHandler();

  // Fetch task assignees
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const response = await api.get(`/tasks/${task.id}/users`);

        if (response.status === 200) {
          setAssignees(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch task assignees: ", error);
      }
    };

    fetchAssignees();
  }, [task]);

  const openAssigneeModal = () => setShowAssigneeModal(true);

  const closeAssigneeModal = () => {
    setShowAssigneeModal(false);
    setSearchQuery("");
    setSearchResults(projectMembers);
  };

  // Filter project members based on search query
  useEffect(() => {
    const results = projectMembers.filter((member) => {
      return (
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setSearchResults(results);
  }, [searchQuery]);

  // Handle selecting a member from the search results
  const handleSelectUser = async (user: User) => {
    if (assignees.some((assignee) => assignee.id === user.id)) {
      try {
        const response = await api.delete(
          `/tasks/${task.id}/users/${user.id}`,
          {
            data: { projectId: project.id },
          }
        );

        if (response.status === 200) {
          setAssignees(assignees.filter((assignee) => assignee.id !== user.id));
        }
      } catch (error) {
        handleApiError(error as AxiosError);
      }
    } else {
      try {
        const response = await api.post(`/tasks/${task.id}/users`, {
          userId: user.id,
          projectId: project.id,
        });

        if (response.status === 201) {
          setAssignees([...assignees, user]);
        }
      } catch (error) {
        handleApiError(error as AxiosError);
      }
    }
  };

  return (
    <>
      <div className="task-members col">
        <div className="members-header">
          <h4>Assignees</h4>
          {userCanPerform("manageTasks") && (
            <button
              type="button"
              className="btn-icon"
              onClick={openAssigneeModal}
            >
              <IoMdAdd size={16} />
            </button>
          )}
        </div>

        <ul className="member-list">
          {assignees &&
            assignees.map((assignee) => (
              <li className="member" key={assignee.id}>
                <img
                  src={assignee.profilePicture || defaultProfilePicture}
                  alt="User Avatar"
                />
                <p>{assignee.name}</p>
              </li>
            ))}
        </ul>
      </div>

      <Modal
        show={showAssigneeModal}
        onHide={closeAssigneeModal}
        dialogClassName="assign-members-modal"
        backdropClassName="task-subModal-backdrop"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign members</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="search-bar">
            <IoSearch size={18} className="search-icon" />
            <input
              name="search"
              id="search"
              type="text"
              placeholder="Search by name, username or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <ul className="search-list">
            {searchResults.length ? (
              searchResults.map((user) => (
                <li
                  className="member"
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                >
                  <img
                    src={user.profilePicture || defaultProfilePicture}
                    alt="User Avatar"
                  />
                  <div className="member-info">
                    <p>{user.name}</p>
                    <p>{user.username}</p>
                  </div>

                  {assignees.some((assignee) => assignee.id === user.id) ? (
                    <FaCheck size={16} color="#8C54FB" className="icon" />
                  ) : (
                    <IoMdAdd size={20} className="icon" />
                  )}
                </li>
              ))
            ) : (
              <li className="no-member-found">No members found</li>
            )}
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TaskMembers;
