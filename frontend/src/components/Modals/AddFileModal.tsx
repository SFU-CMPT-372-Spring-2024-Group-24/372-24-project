// Hooks
import { useState } from 'react';
import { useDropzone } from "react-dropzone";
// Component
import Modal from 'react-bootstrap/Modal'
import { toast } from "react-toastify";
// Icons & styles
import { IoIosCloudUpload } from 'react-icons/io'
import './AddFileModal.scss'
// API
import { api, AxiosError } from '../../api'
// Custom hooks
import { useTasks } from '../../hooks/TaskContext';
import { useApiErrorHandler } from '../../hooks/useApiErrorHandler';

interface Props {
  showAddFileModal: boolean;
  setShowAddFileModal: (show: boolean) => void;
}

const AddFileModal = ({ showAddFileModal, setShowAddFileModal }: Props) => {
  const { project, projectFiles, setProjectFiles } = useTasks();
  const {handleApiError} = useApiErrorHandler();
  const [isAddFileModalHovered, setIsAddFileModalHovered] = useState<boolean>(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await uploadFile(acceptedFiles[0]);
      }
    }
  });
  
  // Upload file
  async function uploadFile(file: File) {
    // Encode file to be sent via HTTP request
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post(`/projects/${project.id}/files`, formData);
      setProjectFiles([...projectFiles, response.data]);
      setShowAddFileModal(false);
      toast.success("File uploaded successfully");
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  }

  return (
    <Modal
      show={showAddFileModal}
      onHide={() => setShowAddFileModal(false)}
      dialogClassName="file-upload-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add file</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          {...getRootProps()}
          style={{ opacity: isDragActive || isAddFileModalHovered ? 0.5 : 1 }}
          onMouseEnter={() => setIsAddFileModalHovered(true)}
          onMouseLeave={() => setIsAddFileModalHovered(false)}
        >
          <input {...getInputProps()} />
          <IoIosCloudUpload size={50} />
          <p>Browse files or drag & drop to upload</p>
        </div>
      </Modal.Body>
    </Modal>
  )
};

export default AddFileModal;