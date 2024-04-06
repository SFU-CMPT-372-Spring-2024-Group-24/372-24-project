// Hooks
import { useState } from "react";
// Components
import AddFileModal from "../../Modals/AddFileModal";
import PreviewFileModal from "../../Modals/PreviewFile/PreviewFileModal";
// Icons & styles
import { IoMdAdd } from "react-icons/io";
import { getFileIcon } from "../../../utils/fileUtils";
// Models
import { FileModel } from "../../../models/FileModel";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";

const Files = () => {
  const { projectFiles, userCanPerform } = useTasks();
  const [showAddFileModal, setShowAddFileModal] = useState<boolean>(false);
  const [showPreviewFileModal, setShowFilePreviewModal] =
    useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileModel>();

  return (
    <>
      <div className="files">
        <h2>
          Files

          {userCanPerform("manageFiles") && (
            <button
              type="button"
              className="btn-icon"
              onClick={() => {
                setShowAddFileModal(!showAddFileModal);
              }}
            >
              <IoMdAdd size={20} />
            </button>
          )}
        </h2>
        
        {projectFiles.map((file) => (
          <div className="file" key={file.id}>
            {getFileIcon(file.type)}
            <p
              className="truncate"
              onClick={() => {
                setShowFilePreviewModal(true);
                setSelectedFile(file);
              }}
            >
              {file.name}
            </p>
          </div>
        ))}
      </div>

      <AddFileModal
        showAddFileModal={showAddFileModal}
        setShowAddFileModal={setShowAddFileModal}
      />

      <PreviewFileModal
        showPreviewFileModal={showPreviewFileModal}
        setShowPreviewFileModal={setShowFilePreviewModal}
        selectedFile={selectedFile}
      />
    </>
  );
};

export default Files;
