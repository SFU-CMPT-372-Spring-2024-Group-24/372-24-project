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
import { List } from "../../models/List";

// Project View Page
// Contains the project info component and 3 task list components
const ProjectViewPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const navigate = useNavigate();

  // Fetch project data from server
  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/projects/${id}`);
      const projectData = await response.json();

      if (projectData) {
        setProject(projectData);
      } else {
        navigate("/404");
      }
    };

    fetchProject();
  }, [id]);

  // Fetch lists data from server
  useEffect(() => {
    const fetchLists = async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/lists/${id}`);
      
      if (response.ok) {
        const listsData = await response.json();
        setLists(listsData);
      } else {
        const errorData = await response.json();
        console.error("Error fetching lists:", errorData.message);
      }
    };

    fetchLists();
  }, [id]);

  return (
    <>
      {project && (
        <div className="project-view-page">
          <ProjectInfo project={project} setProject={setProject} />

          <section className="project">
            <h1 className="gradient-text">{project.name}</h1>

            <div className="project-columns">
              {lists.map((list) => (
                <TaskList
                  key={list.id}
                  listId={list.id}
                  listName={list.name}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ProjectViewPage;
