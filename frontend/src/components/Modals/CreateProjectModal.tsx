// Libraries
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Styles
import './CreateProjectModal.scss';

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const CreateProjectModal = ({ showModal, setShowModal }: Props) => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();

  const closeModal = () => setShowModal(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        description: projectDescription,
      }),
    });

    if (response.ok) {
      const project = await response.json();
      navigate(`/project/${project.id}`);

      setProjectName("");
      setProjectDescription("");
      closeModal();
    } else {
      const errorData = await response.json();
      setErrorMsg(errorData.message);
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

      <div className="error-msg">{errorMsg}</div>

      <form onSubmit={handleCreateProject}>
        <div className="input-field">
          <label htmlFor="project-name">Project Name</label>
          <input type="text" id="project-name" name="project-name" value={projectName} onChange={(e) => setProjectDescription(e.target.value)} />
        </div>

        <div className="input-field">
          <label htmlFor="project-description">Project Description</label>
          <textarea id="project-description" name="project-description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} />
        </div>
      </form>

      <div className="button-group">
        <button
          type="submit"
          className="btn-create-project"
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
