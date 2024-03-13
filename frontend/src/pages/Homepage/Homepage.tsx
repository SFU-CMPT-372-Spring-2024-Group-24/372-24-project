import { IoMdAdd } from "react-icons/io";
import "./Homepage.scss";

const Homepage = () => {
  return (
    <section className="homepage">
      <h1 className="gradient-text">Your Projects</h1>

      <div className="project-list">
        <div className="add-new-project">
          <IoMdAdd size={20}/>
          <p>Add New Project</p>
        </div>
        <div className="project">
          <p>Project 1</p>
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
