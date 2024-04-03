// Hooks
import { useState } from "react";
// Components
import AddFileModal from "../../Modals/AddFileModal";
import PreviewFileModal from "../../Modals/PreviewFileModal";
// Icons & styles
import { IoMdAdd } from "react-icons/io";
import { getFileIcon } from "../../../utils/fileUtils";
// Models
import { FileModel } from "../../../models/FileModel";
import { Project } from "../../../models/Project";

interface Props {
  project: Project;
  files: FileModel[];
  setFiles: (files: FileModel[]) => void;
}

const Files = ({ project, files, setFiles }: Props) => {
  const [showAddFileModal, setShowAddFileModal] = useState<boolean>(false);
  const [showPreviewFileModal, setShowFilePreviewModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileModel>();

  return (<>
    <div className="files">
      <h2>Files
        <button
          type="button"
          className="btn-icon"
          onClick={() => { setShowAddFileModal(!showAddFileModal) }}>
          <IoMdAdd size={20} />
        </button>
      </h2>
      {files.map((file) => (
        <div className="file" key={file.id}>
          {getFileIcon(file.type)}
          <p
            className="truncate"
            onClick={() => { setShowFilePreviewModal(true); setSelectedFile(file) }}
          >
            {file.name}
          </p>
        </div>
      ))}
    </div>

    <AddFileModal
      showAddFileModal={showAddFileModal}
      setShowAddFileModal={setShowAddFileModal}
      projectId={project.id}
      files={files}
      setFiles={setFiles}
    />

    <PreviewFileModal
      showPreviewFileModal={showPreviewFileModal}
      setShowPreviewFileModal={setShowFilePreviewModal}
      projectId={project.id}
      files={files}
      setFiles={setFiles}
      selectedFile={selectedFile}
    />
  </>);
}

export default Files;