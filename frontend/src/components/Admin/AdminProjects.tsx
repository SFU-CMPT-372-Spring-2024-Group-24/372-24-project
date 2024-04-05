import "./AdminProjects.scss";
import { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminProjects = () => {

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserDataAndProjects = async () => {
      try {
        const userResponse = await api.get('/users');
        const userData = userResponse.data;
        const userIDArray = userData.map((user: any) => user.id);
        const allProjects: any[] = [];
        await Promise.all(userIDArray.map(async (userId: string) => {
          const projectResponse = await api.get(`/projects?userId=${userId}`);
          const projectsForUser = projectResponse.data;
          allProjects.push(...projectsForUser);
        }));
        setProjects(allProjects);
      } catch (error) {
        console.error('Error fetching users or projects', error);
      }
    };

    fetchUserDataAndProjects();
  }, []);

  //need to fix: delete all data associated with user (ex. projects, chats)
  const deleteProject = async (projectId: string) => {
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  const toggleDescription = (projectId: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.id === projectId) {
          return { ...project, showDescription: !project.showDescription };
        }
        return project;
      });
    });
  };

  const toggleButtonText = (project: any) => {
    return project.showDescription ? "Less" : "More";
  };
  const renderDescription = (project: any) => {
    return project.showDescription ? (
      <p>
        Description: {project.description || "No description to display"}
      </p>
    ) : null;
  };

  return (
    <div className="admin-projects-container">
      <h2>All Projects In Database</h2>
      <ul className="project-list">
        <li className="title">Projects:</li>
        {projects.map((project) => (
          <li key={project.id} className="project-item">
            <div className="project-header">
              <span className="project-name">{project.name}</span>
              <div className="action-buttons">
                <button id="more-button" onClick={() => toggleDescription(project.id)}>{toggleButtonText(project)}</button>
                <button id="delete-button" onClick={() => deleteProject(project.id)}>Delete</button>
              </div>
            </div>
            <div className="project-description">{renderDescription(project)}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminProjects;
