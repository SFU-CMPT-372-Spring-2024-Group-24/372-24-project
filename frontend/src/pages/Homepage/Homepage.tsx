import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import "./Homepage.scss";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";

// Todo
// 1. Add a new project button
// 2. Display a list of projects fetched from the backend
// 3. Each project should be clickable and navigate to the project page

const Homepage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleModal = () => setShowModal(!showModal);

  const handleCreateProject = () => {
    toggleModal();
  };

  return (
    <section className="homepage">
      <h1 className="gradient-text">Your Projects</h1>

      <div className="project-list">
        <button type="button" className="btn-add-project" onClick={toggleModal}>
          <IoMdAdd size={20} />
          Add New Project
        </button>

        <div
          className="project"
          onClick={() => {
            navigate("/projectview");
          }}
        >
          <p>Sample Project View</p>
        </div>

        <div className="project">
          <p>Project 2</p>
        </div>

        <div className="project">
          <p>Project 3</p>
        </div>

        <div className="project">
          <p>Project 4</p>
        </div>

        <div className="project">
          <p>Project 5</p>
        </div>

        <div className="project">
          <p>Project 6</p>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={toggleModal}
        dialogClassName="create-project-modal"
        backdrop="static"
        keyboard={false}
        centered
      >
        <h2>Create new project</h2>

        <form onSubmit={handleCreateProject}>
          <div className="input-field">
            <label htmlFor="project-name">Project Name</label>
            <input type="text" id="project-name" name="project-name" />
          </div>

          <div className="input-field">
            <label htmlFor="project-description">Project Description</label>
            <textarea id="project-description" />
          </div>
        </form>

        <div className="button-group">
          <button type="submit" className="btn-create-project" onClick={handleCreateProject}>
            Create
          </button>
          <button type="button" className="btn-cancel" onClick={toggleModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default Homepage;
