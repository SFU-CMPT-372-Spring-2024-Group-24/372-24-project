import React, { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminPage = () => {
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

  const deleteUser = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      // Also update the user ID array
      setUserIDArray(userIDArray.filter((id) => id !== userId));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

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
      <h1>Admin Page</h1>

      <h2>All Users In Database</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

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
  );
};

export default AdminPage;
