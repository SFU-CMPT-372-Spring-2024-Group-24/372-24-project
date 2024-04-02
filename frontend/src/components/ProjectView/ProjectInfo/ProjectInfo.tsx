// Libraries
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Icons
import { IoMdTrash } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
// Styles
import "./ProjectInfo.scss";
import "react-toastify/dist/ReactToastify.css";
// Models
import { Project } from "../../../models/Project";
import { User } from "../../../models/User";
// Utils
import { getFileIcon } from "../../../utils/fileUtils";
// API
import { api } from "../../../api";
// Components
import Members from "./Members";
import About from "./About";
// Custom hooks
import { useUser } from "../../../hooks/UserContext";

interface Props {
  project: Project;
  setProject: (project: Project) => void;
  members: User[];
  setMembers: (members: User[]) => void;
}
const ProjectInfo = ({ project, setProject, members, setMembers }: Props) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleDeleteProject = async () => {
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
      const response = await api.delete(`/projects/${project.id}/users/${user!.id}`);
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
        <About project={project} setProject={setProject} />

        <Members project={project} members={members} setMembers={setMembers} />

        <div className="files">
          <h2>Files</h2>
          <div className="file">
            {getFileIcon("doc")}
            <p>example.docx</p>
          </div>
          <div className="file">
            {getFileIcon("xls")}
            <p>example.xsl</p>
          </div>
        </div>
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
          className="btn-leave-delete-project"
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
