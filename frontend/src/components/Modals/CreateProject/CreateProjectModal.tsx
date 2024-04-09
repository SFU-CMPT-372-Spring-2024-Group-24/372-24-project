// Libraries
import Modal from "react-bootstrap/Modal";
// Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
// Styles
import "./CreateProjectModal.scss";
// Hooks
import { useChats } from "../../../hooks/ChatContext";
// Models
import { Project } from "../../../models/Project";
// API
import { api, AxiosError } from "../../../api";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const CreateProjectModal = ({ showModal, setShowModal }: Props) => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { handleApiError } = useApiErrorHandler();

  const { chats, setChats } = useChats();

  const closeModal = () => {
    setErrorMsg("");
    setProjectName("");
    setProjectDescription("");
    setShowModal(false);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await api.post("/projects", {
        name: projectName,
        description: projectDescription,
      });
      const project: Project = response.data.project;
      setChats([response.data.chat, ...chats]);
      navigate(`/projects/${project.id}`);
      closeModal();
    } catch (error) {
      handleApiError(error as AxiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={closeModal}
      dialogClassName="create-project-modal"
      backdrop="static"
      keyboard={false}
      centered
    >
      <h2>Create new project</h2>

      {loading && <div className="loading">Creating your project...</div>}

      {errorMsg && <div className="error-msg">{errorMsg}</div>}

      <form onSubmit={handleCreateProject}>
        <div className="input-field">
          <label htmlFor="project-name">Project Name</label>
          <input
            type="text"
            id="project-name"
            name="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <div className="input-field">
          <label htmlFor="project-description">Project Description</label>
          <textarea
            id="project-description"
            name="project-description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </div>
      </form>

      <div className="button-group">
        <button
          type="submit"
          className="btn-text"
          onClick={handleCreateProject}
        >
          Create
        </button>
        <button type="button" className="btn-cancel" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
