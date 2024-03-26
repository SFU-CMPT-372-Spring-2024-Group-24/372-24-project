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
// Utils
import { getFileIcon } from "../../../utils/fileUtils";
// Files
// import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// API
import { api } from "../../../api";
// Components
import Members from "./Members";

interface Props {
  project: Project;
  setProject: (project: Project) => void;
}
const ProjectInfo = ({ project, setProject }: Props) => {
  const navigate = useNavigate();

  const handleDeleteProject = async () => {
    try {
      const response = await api.delete(`/projects/${project.id}`);
      if (response.status === 200) {
        toast.success(response.data.message, {
          className: "toast-success",
        });
        navigate("/projects");
      }
    } catch (error) {
      console.error("Failed to delete project: ", error);
    }
  };

  return (
    <aside className="project-info">
      <div className="project-description">
        <h2>About</h2>
        <p>{project.description}</p>
      </div>

      <Members project={project} setProject={setProject} />

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
