// Libraries
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import ProjectInfo from "../../components/ProjectView/ProjectInfo/ProjectInfo";
import TaskLists from "../../components/ProjectView/TaskLists/TaskLists";
// Models
import { Project } from "../../models/Project";
import { User } from "../../models/User";
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
  const navigate = useNavigate();

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);

        if (response.status === 200) {
          setProject(response.data);
        }
      } catch (error) {
        navigate("/projects/notfound");
      }
    };

    fetchProject();
  }, []);

  // Fetch project members
  useEffect(() => {
    if (project) {
      const fetchMembers = async () => {
        try {
          const response = await api.get(`/projects/${project.id}/users`);
          setMembers(response.data);
        } catch (error) {
          console.error("Error fetching members:", error);
        }
      };

      fetchMembers();
    }
  }, [project]);

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

            <TaskProvider projectId={project.id} projectMembers={members}>
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
