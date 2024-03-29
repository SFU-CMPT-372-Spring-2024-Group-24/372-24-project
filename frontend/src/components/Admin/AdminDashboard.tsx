import { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminDashboard = () => {
  // const [totalProjects, setTotalProjects] = useState(0); 
  // const [totalUsers, setTotalUsers] = useState(0); 

  // useEffect(() => {
  //   const fetchTotalUsers = async () => {
  //     try {
  //       const response = await api.get('/users');
  //       const userData = response.data;
  //       const numUsers = userData.length; 
  //       setTotalUsers(numUsers);
  //     } catch (error) {
  //       console.error('Error fetching users', error);
  //     }
  //   };

  //   fetchTotalUsers();
  // }, []);


  // useEffect(() => {
  //   const fetchTotalProjects = async () => {
  //     try {
  //       const response = await api.get('/admin');
  //       const projectData = response.data;
  //       const numProjects = projectData.length; 
  //       setTotalProjects(numProjects);
  //     } catch (error) {
  //       console.error('Error fetching projects', error);
  //     }
  //   };

  //   fetchTotalProjects();
  // }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {/* <p>Total number of users: {totalUsers}</p>
      <p>Total number of projects: {totalProjects}</p> */}

    </div>
  );
};

export default AdminDashboard;
