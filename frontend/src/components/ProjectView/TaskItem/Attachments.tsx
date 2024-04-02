// Hooks
import { useEffect, useState, useRef } from "react";
import { useTasks } from "../../../hooks/TaskContext";
// Models
import { FileModel } from "../../../models/FileModel";
import { Task } from "../../../models/Task";
// Components
import AddFileModal from "../../Modals/AddFileModal";
import PreviewFileModal from "../../Modals/PreviewFileModal";
// Icons
import { IoMdAdd, IoMdCloseCircleOutline } from "react-icons/io";
import { getFileIcon } from "../../../utils/fileUtils";
// API
import { api } from "../../../api";

interface Props {
  task: Task;
}

const Attachments = ({ task }: Props) => {
  const { projectId, projectFiles, setProjectFiles } = useTasks();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isShowingFilesDropdown, setIsShowingFilesDropdown] = useState<boolean>(false);
  const [taskFiles, setTaskFiles] = useState<FileModel[]>([]);
  const [isShowingAddFileModal, setIsShowingAddFileModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileModel>();
  const [isShowingPreviewFileModal, setIsShowingPreviewFileModal] = useState<boolean>(false);

  // Files dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsShowingFilesDropdown(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Get task files
  useEffect(() => {
    async function fetchTaskFiles() {
      try {
        const response = await api.get(`/tasks/${task.id}/files`);
        if (response.status === 200) {
          setTaskFiles(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch task files: ", error);
      }
    };
    fetchTaskFiles();
  }, [task]);

  // Add file to task
  async function handleAddFileToTask(fileId: number) {
    try {
      // Add file to task
      await api.post(`/tasks/${task.id}/files`, { fileId });
      // Update task files if it isn't already in the list
      if (!taskFiles.find((file) => file.id === fileId)) {
        setTaskFiles([...taskFiles, projectFiles.find((file) => file.id === fileId)!]);
      }
      setIsShowingFilesDropdown(false);
    } catch (error) {
      console.error("Failed to add file to task: ", error);
    }
  }
  
  // Remove file from task
  async function handleRemoveFileFromTask(fileId: number) {
    try {
      // Remove file from task
      await api.delete(`/tasks/${task.id}/files/${fileId}`);
      // Update task files
      setTaskFiles(taskFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Failed to remove file from task: ", error);
    }
  }

  // Show add file modal
  function showAddFileModal() {
    setIsShowingAddFileModal(true);
  }

  // Show preview file modal
  function showPreviewFileModal(file: FileModel) {
    setSelectedFile(file);
    setIsShowingPreviewFileModal(true);
  }

  return (<>
    <div className="attachments col">
      {/* Header */}
      <div className="attachments-header">
        <h4>Attachments</h4>
        <button
          type="button"
          className="btn-icon"
          onClick={(event) => {
            event.stopPropagation();
            setIsShowingFilesDropdown(!isShowingFilesDropdown);
          }}
        >
          <IoMdAdd size={16} />
        </button>
      </div>

      {/* Dropdown */}
      {isShowingFilesDropdown && (
        <div className="dropdown" ref={dropdownRef}>
          {/* Add file button */}
          <button onClick={showAddFileModal}>
            <div className="upload-file">
              <IoMdAdd size={20} />
              <p>Add file</p>
            </div>
          </button>
          {/* Project files */}
          {projectFiles.map((file: FileModel) => (
            <button key={file.id} onClick={() => handleAddFileToTask(file.id)}>
              <div className="file">
                {getFileIcon(file.type)}
                <p>{file.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Task files */}
      {taskFiles.map((file: FileModel) => (<div key={file.id} className="task-file">
        <button onClick={() => showPreviewFileModal(file)}>
          <div className="file">
            {getFileIcon(file.type)}
            <p>{file.name}</p>
          </div>
        </button>
        <button className="remove-from-task" title="Remove from task" onClick={() => handleRemoveFileFromTask(file.id)}>
          <IoMdCloseCircleOutline size={20} />
        </button>
      </div>))}
    </div>

    {/* Add file modal */}
    {isShowingAddFileModal && (
      <AddFileModal
        projectId={projectId}
        files={projectFiles}
        setFiles={setProjectFiles}
        showAddFileModal={isShowingAddFileModal}
        setShowAddFileModal={setIsShowingAddFileModal}
      />
    )}

    {/* Preview file modal */}
    {isShowingPreviewFileModal && (
      <PreviewFileModal
        showPreviewFileModal={isShowingPreviewFileModal}
        setShowPreviewFileModal={setIsShowingPreviewFileModal}
        projectId={projectId}
        selectedFile={selectedFile}
        files={projectFiles}
        setFiles={setProjectFiles}
      />
    )}
  </>);
};

export default Attachments;