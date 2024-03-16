// Icons
import { IoMdAdd } from "react-icons/io";
// Libraries
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// Styles
import "./Homepage.scss";
// Components
import CreateProjectModal from "../../components/Modals/CreateProjectModal";

// Todo
// 1. Add a new project button
// 2. Display a list of projects fetched from the backend
// 3. Each project should be clickable and navigate to the project page

const Homepage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleShowModal = () => setShowModal(true);

  return (
    <section className="homepage">
      <h1 className="gradient-text">Your Projects</h1>

      <div className="project-list">
        <button type="button" className="btn-add-project" onClick={handleShowModal}>
          <IoMdAdd size={20} />
          Add New Project
        </button>

        <CreateProjectModal showModal={showModal} setShowModal={setShowModal} />

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
    </section>
  );
};

export default Homepage;
