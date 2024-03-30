// Libraries
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// Icons
import { IoMdTrash } from "react-icons/io";
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

interface Props {
  project: Project;
  setProject: (project: Project) => void;
  members: User[];
  setMembers: (members: User[]) => void;
}
const ProjectInfo = ({ project, setProject, members, setMembers }: Props) => {
  const navigate = useNavigate();

  const handleDeleteProject = async () => {
    try {
      const response = await api.delete(`/projects/${project.id}`);
      if (response.status === 200) {
        toast(response.data.message);
        navigate("/projects");
      }
    } catch (error) {
      console.error("Failed to delete project: ", error);
    }
  };

  return (
    <aside className="project-info">
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

      <button
        type="button"
        className="btn-delete-project"
        onClick={handleDeleteProject}
      >
        <IoMdTrash size={18} />
        Delete this project
      </button>
    </aside>
  );
};

export default ProjectInfo;
