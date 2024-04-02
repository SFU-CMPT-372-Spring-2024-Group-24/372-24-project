// Libraries
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import ProjectInfo from "../../components/ProjectView/ProjectInfo/ProjectInfo";
import TaskLists from "../../components/ProjectView/TaskLists/TaskLists";
// Models
import { Project } from "../../models/Project";
import { User } from "../../models/User";
import { FileModel } from "../../models/FileModel";
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
  const [files, setFiles] = useState<FileModel[]>([]);
  const navigate = useNavigate();

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        navigate("/projects/404");
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

  // Fetch project files
  useEffect(() => {
    if (project) {
      const fetchFiles = async () => {
        try {
          const response = await api.get(`/projects/${project.id}/files`);
          setFiles(response.data);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };

      fetchFiles();
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
            files={files}
            setFiles={setFiles}
          />

          <section className="project">
            <h1 className="gradient-text">{project.name}</h1>

            <TaskProvider projectId={project.id} projectMembers={members} projectFiles={files} setProjectFiles={setFiles}>
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
