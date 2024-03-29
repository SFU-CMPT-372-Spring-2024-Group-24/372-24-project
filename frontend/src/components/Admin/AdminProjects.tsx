import "./AdminProjects.scss";
import { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminProjects = () => {

  const [users, setUsers] = useState<any[]>([]);
  const [userIDArray, setUserIDArray] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const userData = response.data;
        setUsers(userData);
        const ids = userData.map((user: any) => user.id);
        setUserIDArray(ids);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    const fetchUserProjects = async (userId: string) => {
      try {
        const response = await api.get(`/projects?userId=${userId}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching user projects", error);
        return [];
      }
    };

    const fetchProjectsForAllUsers = async () => {
      try {
        const allProjects: { [key: string]: { id: string, name: string, description: string } } = {};
        await Promise.all(userIDArray.map(async (userId) => {
          const projectsForUser = await fetchUserProjects(userId);
          projectsForUser.forEach((project: any) => {
            allProjects[project.id] = project;
          });
        }));
        const projectsArray = Object.values(allProjects);
        setProjects(projectsArray);
      } catch (error) {
        console.error('Error fetching projects', error);
      }
    };

    fetchUsers();
    fetchProjectsForAllUsers();
  }, [userIDArray]);

  const deleteProject = async (projectId: string) => {
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project', error);
    }
  };

  return (
    <div>
      <h2>All Projects In Database</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} - {project.description}
            <button onClick={() => deleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminProjects