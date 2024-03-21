// Icons
import { IoMdAdd, IoMdTrash } from "react-icons/io";
// Styles
import "./ProjectInfo.scss";
// Models
import { Project } from "../../../models/Project";
// Utils
import { getFileIcon } from "../../../utils/fileUtils";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";

interface Props {
  project: Project;
  setProject: (project: Project) => void;
}
const ProjectInfo = ({ project }: Props) => {
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

        {project.Users.map((user) => (
          <div className="member" key={user.id}>
            <img
              src={user.profilePicture || defaultProfilePicture}
              alt="User Avatar"
            />
            <p>{user.name}</p>
          </div>
        ))}
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
