// Libraries
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Icons
import { IoMdTrash } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
// Styles
import "./ProjectInfo.scss";
import "react-toastify/dist/ReactToastify.css";
// API
import { api, AxiosError } from "../../../api";
// Components
import Members from "./Members";
import About from "./About";
import Files from "./Files";
// Custom hooks
import { useUser } from "../../../hooks/UserContext";
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";

const ProjectInfo = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { project, projectMembers, userCanPerform } = useTasks();
  const {handleApiError} = useApiErrorHandler();

  // Delete project
  const handleDeleteProject = async () => {
    try {
      const response = await api.delete(`/projects/${project.id}`);
      if (response.status === 200) {
        toast.success("Project has been deleted for you and all members.");
        navigate("/projects");
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Leave project
  const handleLeaveProject = async () => {
    // If the project doesn't have any Owner excluding the current user, the user can't leave the project
    const otherOwners = projectMembers.filter(
      (member) => member.role?.name === "Owner" && member.id !== user!.id
    );
    if (!otherOwners.length) {
      toast.error("You can't leave the project because you are the only owner.");
      return;
    }

    try {
      const response = await api.delete(`/projects/${project.id}/users`);
      if (response.status === 200) {
        toast("You have left the project.");
        navigate("/projects");
      }
    } catch (error) {
      handleApiError(error as AxiosError);
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
          onClick={handleLeaveProject}
        >
          <BiLogOutCircle size={18} />
          Leave this project
        </button>

        {userCanPerform("manageProject") && (
          <button
            type="button"
            className="btn-leave-delete-project"
            onClick={handleDeleteProject}
          >
            <IoMdTrash size={18} />
            Delete this project
          </button>
        )}
      </div>
    </aside>
  );
};

export default ProjectInfo;
