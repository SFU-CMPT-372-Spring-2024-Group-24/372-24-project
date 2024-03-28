// Libraries
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import ProjectInfo from "../../components/ProjectView/ProjectInfo/ProjectInfo";
import TaskList from "../../components/ProjectView/TaskList/TaskList";
// Models
import { Project } from "../../models/Project";
import { User } from "../../models/User";
// Styles
import "./ProjectViewPage.scss";
import { List } from "../../models/List";
// API
import { api } from "../../api";

// Project View Page
// Contains the project info component and 3 task list components
const ProjectViewPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const navigate = useNavigate();

  // Fetch project data from server
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);

        setMembers(response.data.Users);
        setProject(response.data);
      } catch (error) {
        navigate("/projects/404");
      }
    };

    fetchProject();
  }, [id]);

  // Fetch lists data from server
  useEffect(() => {
    if (project) {
      const fetchLists = async () => {
        try {
          const response = await api.get(`/lists/${id}`);
          setLists(response.data);
        } catch (error) {
          console.error("Error fetching lists:", error);
        }
      };

      fetchLists();
    }
  }, [id, project]);

  return (
    <>
      {project && (
        <div className="project-view-page">
          <ProjectInfo project={project} setProject={setProject} members={members} setMembers={setMembers} />

          <section className="project">
            <h1 className="gradient-text">{project.name}</h1>

            <div className="project-columns">
              {lists.map((list) => (
                <TaskList key={list.id} listId={list.id} listName={list.name} />
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default ProjectViewPage;
