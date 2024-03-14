import { FaRegClock } from "react-icons/fa6";
import ProjectInfo from "../../components/ProjectView/ProjectInfo/ProjectInfo";

import "./ProjectViewPage.scss";
import TaskList from "../../components/ProjectView/TaskList/TaskList";

const ProjectViewPage = () => {
  return (
    <div className="project-view-page">
      <ProjectInfo />

      <section className="project">
        <h1 className="gradient-text">Project Name</h1>

        <div className="project-columns">
          <TaskList listName="To do" />

          <TaskList listName="In progress" />

          <TaskList listName="Done" />
        </div>
      </section>
    </div>
  );
};

export default ProjectViewPage;
