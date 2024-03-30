// Libraries
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import ProjectInfo from "../../components/ProjectView/ProjectInfo/ProjectInfo";
import TaskLists from "../../components/ProjectView/TaskLists/TaskLists";
// Models
import { Project } from "../../models/Project";
import { User } from "../../models/User";
import { List } from "../../models/List";
// Styles
import "./ProjectViewPage.scss";
// API
import { api } from "../../api";
// Custom hooks
import { TaskProvider } from "../../hooks/TaskContext";

const ProjectViewPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [initialLists, setInitialLists] = useState<List[]>([]);
  const navigate = useNavigate();

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

    const fetchListsAndTasks = async () => {
      try {
        // Fetch lists for the project
        const response = await api.get(`/lists/${id}`);
        setInitialLists(response.data);

        // Fetch tasks for each list
        response.data.forEach(async (list: List) => {
          try {
            const response = await api.get(`/tasks/${list.id}`);
            list.tasks = response.data;
            setInitialLists((prevLists) =>
              prevLists.map((prevList) =>
                prevList.id === list.id ? list : prevList
              )
            );
          } catch (error) {
            console.error("Error fetching tasks:", error);
          }
        });
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchListsAndTasks();
  }, []);

  return (
    <>
      {project && (
        <div className="project-view-page">
          <ProjectInfo
            project={project}
            setProject={setProject}
            members={members}
            setMembers={setMembers}
          />

          <section className="project">
            <h1 className="gradient-text">{project.name}</h1>

            <TaskProvider initialLists={initialLists} projectMembers={members}>
              <div className="project-lists">
                <TaskLists />
              </div>
            </TaskProvider>
          </section>
        </div>
      )}
    </>
  );
};

export default ProjectViewPage;
