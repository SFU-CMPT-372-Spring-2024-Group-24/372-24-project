import defaultProfilePicture from '../../assets/default-profile-picture.png';
import React, { useState } from 'react';
import './AdminMenu.scss';
import { LuUsers } from "react-icons/lu";
import { LuFolderTree } from "react-icons/lu";
import { MdOutlineSpaceDashboard } from "react-icons/md";

interface AdminMenuProps {
  toggleUsers: () => void;
  toggleProjects: () => void;
  toggleDashboard: () => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ toggleUsers, toggleProjects, toggleDashboard }) => {
  const [usersActive, setUsersActive] = useState(false);
  const [projectsActive, setProjectsActive] = useState(false);
  const [dashboardActive, setDashboardActive] = useState(false);

  const handleToggleUsers = () => {
    if (!usersActive) {
      toggleUsers();
      setUsersActive(true);
      setProjectsActive(false);
      setDashboardActive(false);
    }
  };

  const handleToggleProjects = () => {
    if (!projectsActive) {
      toggleProjects();
      setProjectsActive(true);
      setUsersActive(false);
      setDashboardActive(false);
    }
  };

  const handleToggleDashboard = () => {
    if (!dashboardActive) {
      toggleDashboard();
      setDashboardActive(true);
      setUsersActive(false);
      setProjectsActive(false);
    }
  };

  return (
    <div className='admin-menu-container'>
      <div className='profile'>
        <img src={defaultProfilePicture} alt="Profile" className='profile-picture' />
      </div>
      <div className='greeting-container'>
        <span className='greeting'>Hello Admin {/* replace with actual admin name */}</span>
      </div>
      <ul className="admin-menu">
        <li onClick={handleToggleDashboard} className={dashboardActive ? 'active' : ''}>
          <MdOutlineSpaceDashboard />
          <span className='list'>Dashboard</span>
        </li>
        <li onClick={handleToggleUsers} className={usersActive ? 'active' : ''}>
          <LuUsers />
          <span className='list'>Users</span>
        </li>
        <li onClick={handleToggleProjects} className={projectsActive ? 'active' : ''}>
          <LuFolderTree />
          <span className='list'>Projects</span>
        </li>
      </ul>
    </div>
  );
};

export default AdminMenu;
