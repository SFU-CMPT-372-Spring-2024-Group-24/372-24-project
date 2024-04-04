// Libraries
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import ProjectInfo from "../../components/ProjectView/ProjectInfo/ProjectInfo";
import ProjectBoard from "../../components/ProjectView/ProjectBoard/ProjectBoard";
// Models
import { Project } from "../../models/Project";
import { Role } from "../../models/ProjectRole";
// Styles
import "./ProjectViewPage.scss";
// API
import { api } from "../../api";
// Custom hooks
import { TaskProvider } from "../../hooks/TaskContext";
import { useUser } from "../../hooks/UserContext";

const ProjectViewPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
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

  // Fetch user role in project
  useEffect(() => {
    if (!project || !user) return;

    const fetchUserRole = async () => {
      try {
        const response = await api.get(`/roles/${project.id}`);
        setUserRole(response.data);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [project]);

  return (
    <>
      {project && userRole && (
        <div className="project-view-page">
          <TaskProvider
            project={project}
            setProject={setProject}
            userRole={userRole}
            setUserRole={setUserRole}
          >
            {/* Project description, members, files on left panel*/}
            <ProjectInfo />

            {/* Project board on right panel */}
            <ProjectBoard />
          </TaskProvider>
        </div>
      )}
    </>
  );
};

export default ProjectViewPage;
