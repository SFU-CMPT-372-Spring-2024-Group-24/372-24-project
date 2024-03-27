
import { useEffect, useState } from "react";
import { Project } from "../../models/Project";
// API
import { api } from '../../api';

const Adminpage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleDeleteUser = async (id: number) => {
    try {
      await fetch(`${import.meta.env.VITE_APP_API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  }

  const handleDeleteProject = async (id: number) => {
    try {
      await fetch(`${import.meta.env.VITE_APP_API_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project', error);
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/users`);
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
    // fetchProjects();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/projects?userId=${2}`);
        // const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/projects`);
        const projectsData = await response.json();

        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching user projects", error);
      }
    };

    fetchProjects();
  }, []);


  return (
    <div>
      <h1>Admin Page</h1>

      <h2>All Users In Database</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h2>All Projects In Database</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} - {project.description}
            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {/* <ul>
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.id}>
              {project.name} - {project.description}
            </li>
          ))
        ) : (
          <li>No projects available</li>
        )}
      </ul> */}
    </div>
  );
};

export default Adminpage;