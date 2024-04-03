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

  const [editingName, setEditingName] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);

        if (response.status === 200) {
          setProject(response.data);
          setNewName(response.data.name);
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

  // Edit project name
  const handleEditProjectName = async () => {
    if (!project) return;

    const trimmedName = newName.trim();

    if (!trimmedName || trimmedName === project.name) {
      setNewName(project.name);
      setEditingName(false);
      return;
    }

    try {
      const response = await api.put(`/projects/${project.id}`, {
        name: trimmedName,
      });

      if (response.status === 200) {
        setProject(response.data);
        setNewName(response.data.name);
        setEditingName(false);
      }
    } catch (error) {
      console.error("Error editing project name:", error);
    }
  };

  return (
    <>
      {project && (
        <div className="project-view-page">
          {/* Project description, members, files on left panel*/}
          <ProjectInfo
            project={project}
            setProject={setProject}
            members={members}
            setMembers={setMembers}
            files={files}
            setFiles={setFiles}
          />
      
          {/* Task lists on right panel */}
          <section className="project">
            {/* Project name */}
            <div
              className={`project-title ${editingName ? "editing" : ""}`}
              onClick={() => setEditingName(true)}
            >
              {editingName ? (
                <input
                  id="project-name"
                  name="project-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleEditProjectName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditProjectName();
                  }}
                  autoFocus
                />
              ) : (
                <h1 className="gradient-text">{project.name}</h1>
              )}
            </div>

            {/* Task Lists */}
            <TaskProvider
              projectId={project.id}
              projectMembers={members}
              projectFiles={files}
              setProjectFiles={setFiles}
            >
              <TaskLists />
            </TaskProvider>
          </section>
        </div>
      )}
    </>
  );
};

export default ProjectViewPage;
