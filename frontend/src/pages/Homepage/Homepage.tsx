import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import "./Homepage.scss";

// Todo
// 1. Add a new project button
// 2. Display a list of projects fetched from the backend
// 3. Each project should be clickable and navigate to the project page

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <section className="homepage">
      <h1 className="gradient-text">Your Projects</h1>

      <div className="project-list">
        <div className="add-new-project">
          <IoMdAdd size={20}/>
          <p>Add New Project</p>
        </div>
        <div className="project" onClick={() => {navigate("/projectview")}}>
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
