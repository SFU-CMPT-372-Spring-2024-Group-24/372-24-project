// Icons
import { IoMdAdd } from "react-icons/io";
// Libraries
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// Styles
import "./Homepage.scss";
// Components
import CreateProjectModal from "../../components/Modals/CreateProjectModal";
// Models
import { Project } from "../../models/Project";
// Hooks
import { useUser } from "../../hooks/UserContext";
// API
import { api } from "../../api";

const Homepage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useUser();

  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await api.get(`/projects?userId=${user!.id}`);

        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching user projects", error);
      }
    };

    fetchUserProjects();
  }, []);

  return (
    <section className="homepage">
      <h1 className="gradient-text">Your Projects</h1>

      <ul className="project-list">
        <button
          type="button"
          className="btn-add-project"
          onClick={handleShowModal}
        >
          <IoMdAdd size={20} />
          Add New Project
        </button>

        {projects.map((project) => (
          <li key={project.id} className="project">
            <Link to={`/projects/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
      {user?.isAdmin && (
        <Link to="/admin" className="go-to-admin-button">
          Go To Admin Dashboard
        </Link>
      )}
      <CreateProjectModal showModal={showModal} setShowModal={setShowModal} />
    </section>
  );
};

export default Homepage;
