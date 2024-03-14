import { IoMdAdd, IoMdTrash } from "react-icons/io";
import {
  FaFile,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa6";
import { FaFileArchive } from "react-icons/fa";

import "./ProjectInfo.scss";

const ProjectInfo = () => {
  const getFileIcon = (fileExtension: string) => {
    switch (fileExtension) {
      case "pdf":
        return <FaFilePdf size={20} color="F40F02" />;
      case "doc":
      case "docx":
        return <FaFileWord size={20} color="2b579a" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel size={20} color="217346" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint size={20} color="d24726" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage size={20} color="48c96f" />;
      case "zip":
      case "rar":
        return <FaFileArchive size={20} color="4D4A4F" />;
      default:
        return <FaFile size={20} />;
    }
  };

  return (
    <aside className="project-info">
      <div className="project-description">
        <h2>About</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit,
          magnam?
        </p>
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
