// Libraries
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Components
import ProjectInfo from "../../components/ProjectView/ProjectInfo/ProjectInfo";
import TaskLists from "../../components/ProjectView/TaskLists/TaskLists";
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

              <TaskLists />
            </section>
          </TaskProvider>
        </div>
      )}
    </>
  );
};

export default ProjectViewPage;
