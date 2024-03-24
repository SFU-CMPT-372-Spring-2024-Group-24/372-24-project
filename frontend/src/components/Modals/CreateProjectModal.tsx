// Libraries
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Styles
import './CreateProjectModal.scss';
// Hooks
import { useUser } from "../../hooks/UserContext";
// Models
import { Project } from "../../models/Project";
// API
import { api } from "../../api";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const CreateProjectModal = ({ showModal, setShowModal }: Props) => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useUser();

  const closeModal = () => setShowModal(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrorMsg("You must be logged in to create a project.");
      return;
    }

    // const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/projects`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: projectName,
    //     description: projectDescription,
    //     userId: user.id,
    //   }),
    // });

    // if (response.ok) {
    //   const project: Project = await response.json();
      
    //   navigate(`/project/${project.id}`);

    //   setProjectName("");
    //   setProjectDescription("");
    //   closeModal();
    // } else {
    //   const errorData = await response.json();
    //   setErrorMsg(errorData.message);
    // }

    try {
      const response = await api.post("/projects", {
        name: projectName,
        description: projectDescription,
        userId: user.id,
      });

      const project: Project = response.data;
      
      navigate(`/projects/${project.id}`);

      setProjectName("");
      setProjectDescription("");
      closeModal();
    } catch (error) {
      setErrorMsg("An error occurred while creating the project.");
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
          <input type="text" id="project-name" name="project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
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
