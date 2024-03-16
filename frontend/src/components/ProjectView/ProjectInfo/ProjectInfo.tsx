// Icons
import { IoMdAdd, IoMdTrash } from "react-icons/io";
// Styles
import "./ProjectInfo.scss";
// Models
import { Project } from "../../../models/Project";
// Utils
import { getFileIcon } from "../../../utils/fileUtils";

interface Props {
  project: Project;
  setProject: (project: Project) => void;
}
const ProjectInfo = ({ project, setProject }: Props) => {

  return (
    <aside className="project-info">
      <div className="project-description">
        <h2>About</h2>
        <p>{project.description}</p>
      </div>

      <div className="members">
        <div className="title">
          <h2>Members</h2>
          <IoMdAdd size={20} className="add-member-icon" />
        </div>

        <div className="member">
          <img
            src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User Avatar"
          />
          <p>John Doe</p>
        </div>
        <div className="member">
          <img
            src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User Avatar"
          />
          <p>Mary Ann</p>
        </div>
      </div>

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

      <div className="delete-project">
        <IoMdTrash size={18} />
        <p>Delete this project</p>
      </div>
    </aside>
  );
};

export default ProjectInfo;
