// Libraries
import { toast } from "react-toastify";
// Icons and styles
import { IoMdTrash } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
import "./ProjectInfo.scss";
import "react-toastify/dist/ReactToastify.css";
// API
import { api, AxiosError } from "../../../api";
// Components
import Members from "./Members";
import About from "./About";
import Files from "./Files";
import ConfirmationModal from "../../Modals/ConfirmationModal/ConfirmationModal";
// Hooks
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/UserContext";
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
import { useChats } from "../../../hooks/ChatContext";
import { useState } from "react";

const ProjectInfo = () => {
  // User
  const { user } = useUser();
  // Navigate
  const navigate = useNavigate();
  // Task context
  const { project, projectMembers, userCanPerform } = useTasks();
  // Chat context
  const { chats, setChats } = useChats();
  // Error handling
  const { handleApiError } = useApiErrorHandler();
  // Confirmation modal for deleting a project
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  const [confirmMsg2, setConfirmMsg2] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");

  // Delete project
  const handleDeleteProject = async () => {
    try {
      const response = await api.delete(`/projects/${project.id}`);
      if (response.status === 200) {
        setChats(chats.filter((chat) => chat.id !== response.data.id));
        toast.success("Project has been deleted for you and all members.");
        navigate("/projects");
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  // Leave project
  const handleLeaveProject = async () => {
    // If the project doesn't have any Owner excluding the current user, the user can't leave the project
    const otherOwners = projectMembers.filter(
      (member) => member.role?.name === "Owner" && member.id !== user!.id
    );
    if (!otherOwners.length) {
      toast.error(
        "You can't leave the project because you are the only owner."
      );
      setShowConfirmationModal(false);
      return;
    }

    try {
      const response = await api.delete(`/projects/${project.id}/users`);
      if (response.status === 200) {
        toast("You have left the project.");
        navigate("/projects");
      }
      // Get the chatID from the response, find the chat in the list of chats, remove that specifc chat
      setChats(chats.filter((chat) => chat.id !== response.data.id));
    } catch (error) {
      handleApiError(error as AxiosError);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  return (
    <aside className="project-info">
      <div className="project-info">
        <About />
        <Members />
        <Files />
      </div>

      <div className="button-group">
        <button
          type="button"
          className="btn-leave-delete-project"
          onClick={() => {
            setConfirmMsg("Are you sure you want to leave this project?");
            setConfirmMsg2("If you are the only owner, please first transfer the ownership to another member. If no members are left, please delete the project instead.");
            setConfirmText("Yes! I want to leave this project.");
            setShowConfirmationModal(true);
          }}
        >
          <BiLogOutCircle size={18} />
          Leave this project
        </button>

        {userCanPerform("manageProject") && (
          <button
            type="button"
            className="btn-leave-delete-project"
            onClick={() => {
              setConfirmMsg("Are you sure you want to delete this project?");
              setConfirmMsg2("All tasks, comments, files, and members will be deleted.");
              setConfirmText("Yes! Delete my project permanently.");
              setShowConfirmationModal(true);
            }}
          >
            <IoMdTrash size={18} />
            Delete this project
          </button>
        )}
      </div>

      <ConfirmationModal
        show={showConfirmationModal}
        message={confirmMsg}
        secondMessage={confirmMsg2}
        confirmText={confirmText}
        onConfirm={
          confirmText === "Yes! I want to leave this project."
            ? handleLeaveProject
            : handleDeleteProject
        }
        onCancel={() => setShowConfirmationModal(false)}
      />
    </aside>
  );
};

export default ProjectInfo;
