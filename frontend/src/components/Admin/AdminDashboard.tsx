import { api } from '../../api';
import './AdminDashboard.scss';
import React, { useState, useEffect } from 'react';
import { FaRegUser } from "react-icons/fa6";
import { Link } from 'react-router-dom';

interface AdminDashProps {
  toggleUsers: () => void;
  toggleProjects: () => void;
}

const AdminDashboard: React.FC<AdminDashProps> = ({ toggleUsers, toggleProjects }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersActive, setUsersActive] = useState(false);
  const [projectsActive, setProjectsActive] = useState(false);

  const handleToggleUsers = () => {
    if (!usersActive) {
      toggleUsers();
      setUsersActive(true);
      setProjectsActive(false);
    }
  };

  const handleToggleProjects = () => {
    if (!projectsActive) {
      toggleProjects();
      setProjectsActive(true);
      setUsersActive(false);
    }
  };

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await api.get('/users');
        const userData = response.data;
        const numUsers = userData.length;
        setTotalUsers(numUsers);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchTotalUsers();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <p>Total Users: <br /><span className="total-users"><FaRegUser />{totalUsers}</span></p>
      <div className="dash-box">
        <ul className="admin-dash">
          <li>
            <div className={`box ${usersActive ? 'active' : ''} user`} onClick={handleToggleUsers}>
              <button className='list-button'>View All Users</button>
            </div>
          </li>
          <li>
            <div className={`box ${projectsActive ? 'active' : ''} project`} onClick={handleToggleProjects}>
              <button className='list-button'>View All Projects</button>
            </div>
          </li>
        </ul>
      </div>
      <Link to="/projects" className="go-to-homepage-button">Go To Application Homepage</Link>
    </div>
  );
};

export default AdminDashboard;
