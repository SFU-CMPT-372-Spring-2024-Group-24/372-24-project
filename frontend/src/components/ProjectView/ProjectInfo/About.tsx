// Libraries
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
// Icons
import { IoSettingsOutline } from "react-icons/io5";
// API
import { api } from "../../../api";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";

const About = () => {
  const { project, setProject, userCanPerform } = useTasks();
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>(
    project.description
  );

  const openAboutModal = () => setShowAboutModal(true);

  const closeAboutModal = () => {
    setShowAboutModal(false);
    setProjectDescription(project.description);
  };

  const handleChangeDescription = async () => {
    try {
      const response = await api.put(`/projects/${project.id}`, {
        description: projectDescription,
      });

      setProject(response.data);
      closeAboutModal();
    } catch (error) {
      console.error("Failed to update project description: ", error);
    }
  };

  return (
    <>
      <div className="project-description">
        <h2>
          About
          {userCanPerform("manageProject") && (
            <button type="button" className="btn-icon" onClick={openAboutModal}>
              <IoSettingsOutline size={20} />
            </button>
          )}
        </h2>
        <p>{project.description}</p>
      </div>

      <Modal
        show={showAboutModal}
        onHide={closeAboutModal}
        dialogClassName="project-about-modal"
        backdropClassName="project-about-modal-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit project description</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="input-field">
            <label htmlFor="project-description">Project Description</label>
            <textarea
              id="project-description"
              name="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="button-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={closeAboutModal}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-text"
              onClick={handleChangeDescription}
            >
              Save changes
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default About;
