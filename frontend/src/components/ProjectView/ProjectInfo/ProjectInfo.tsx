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
import { FileModel } from "../../../models/FileModel";
// API
import { api } from "../../../api";
// Components
import Members from "./Members";
import About from "./About";
import Files from "./Files";

interface Props {
  project: Project;
  setProject: (project: Project) => void;
  members: User[];
  setMembers: (members: User[]) => void;
  files: FileModel[];
  setFiles: (files: FileModel[]) => void;
}
const ProjectInfo = ({ project, setProject, members, setMembers, files, setFiles }: Props) => {
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
      <Files project={project} files={files} setFiles={setFiles} />
      <button type="button" className="btn-delete-project" onClick={handleDeleteProject}>
        <IoMdTrash size={18} />
        Delete this project
      </button>
    </aside>
  );
};

export default ProjectInfo;
