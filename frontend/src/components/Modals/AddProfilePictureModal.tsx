// Hooks
import { useApiErrorHandler } from '../../hooks/useApiErrorHandler';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUser } from '../../hooks/UserContext';
// Libraries
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
// API
import { api, AxiosError } from '../../api';
// Icons
import { IoIosCloudUpload } from 'react-icons/io';

interface Props {
  showAddProfilePictureModal: boolean;
  setShowAddProfilePictureModal: (show: boolean) => void;
}

const AddProfilePictureModal = ({ showAddProfilePictureModal, setShowAddProfilePictureModal }: Props) => {
  const { user, setUser } = useUser();
  const { handleApiError } = useApiErrorHandler();
  const [isAddFileModalHovered, setIsAddFileModalHovered] = useState<boolean>(false);
  // Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await uploadFile(acceptedFiles[0]);
      }
    }
  });

  if (!user) {
    return null;
  }

  // Upload file
  async function uploadFile(profilePicture: File) {
    // Encode file to be sent via HTTP request
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    try {
      const response = await api.post(`/users/profile-picture`, formData);
      setUser(response.data.user);
      setShowAddProfilePictureModal(false);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      handleApiError(error as AxiosError);
      console.log(error);
      
    }
  }

  return (
    <Modal
      show={showAddProfilePictureModal}
      onHide={() => setShowAddProfilePictureModal(false)}
      dialogClassName="file-upload-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Upload Profile Picture</Modal.Title>
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
  );
};

export default AddProfilePictureModal;