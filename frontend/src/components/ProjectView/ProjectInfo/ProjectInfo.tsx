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
import { api } from "../../../api";
// Components
import Members from "./Members";
import About from "./About";
import Files from "./Files";
// Custom hooks
import { useUser } from "../../../hooks/UserContext";
import { useTasks } from "../../../hooks/TaskContext";

const ProjectInfo = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { userRole, project } = useTasks();

  const handleDeleteProject = async () => {
    if (userRole.name !== "Owner") {
      toast.error("Only the owner can delete the project.");
      return;
    }

    try {
      const response = await api.delete(`/projects/${project.id}`);
      if (response.status === 200) {
        toast("Project has been deleted for you and all members.");
        navigate("/projects");
      }
    } catch (error) {
      console.error("Failed to delete project: ", error);
    }
  };

  const handleLeaveProject = async () => {
    try {
      const response = await api.delete(
        `/projects/${project.id}/users/${user!.id}`
      );
      if (response.status === 200) {
        toast("You have left the project.");
        navigate("/projects");
      }
    } catch (error) {
      console.error("Failed to leave project: ", error);
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

        <button
          type="button"
          className={`btn-leave-delete-project ${
            userRole.name !== "Owner" ? "disabled" : ""
          }`}
          onClick={handleDeleteProject}
        >
          <IoMdTrash size={18} />
          Delete this project
        </button>
      </div>
    </aside>
  );
};

export default ProjectInfo;
