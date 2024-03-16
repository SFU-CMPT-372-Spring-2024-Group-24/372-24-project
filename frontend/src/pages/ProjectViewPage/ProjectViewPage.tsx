// Libraries
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import ProjectInfo from "../../components/ProjectView/ProjectInfo/ProjectInfo";
import TaskList from "../../components/ProjectView/TaskList/TaskList";
// Models
import { Project } from "../../models/Project";
// Styles
import "./ProjectViewPage.scss";

const ProjectViewPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`/api/projects/${id}`);
      const projectData = await response.json();

      if (projectData) {
        setProject(projectData);
      } else {
        navigate("/404");
      }
    };

    fetchProject();
  }, [id]);

  return (
    <>
      {project && (
        <div className="project-view-page">
          <ProjectInfo project={project} setProject={setProject} />

          <section className="project">
            <h1 className="gradient-text">{project.name}</h1>

            <div className="project-columns">
              <TaskList listName="To do" />

              <TaskList listName="In progress" />

              <TaskList listName="Done" />
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ProjectViewPage;
