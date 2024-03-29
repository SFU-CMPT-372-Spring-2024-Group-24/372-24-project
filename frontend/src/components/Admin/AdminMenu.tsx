import defaultProfilePicture from '../../assets/default-profile-picture.png';
import React, { useState } from 'react';
import './AdminMenu.scss';
import { FaUserAlt } from "react-icons/fa";
import { LuFolderTree } from "react-icons/lu";

interface AdminMenuProps {
  toggleUsers: () => void;
  toggleProjects: () => void;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ toggleUsers, toggleProjects }) => {
  const [usersActive, setUsersActive] = useState(false);
  const [projectsActive, setProjectsActive] = useState(false);

  const handleToggleUsers = () => {
    toggleUsers();
    setUsersActive(true);
    setProjectsActive(false); 
  };

  const handleToggleProjects = () => {
    toggleProjects();
    setProjectsActive(true);
    setUsersActive(false); 
  };

  return (
    <div className='admin-menu-container'>
      <div className='profile'>
        <img src={defaultProfilePicture} alt="Profile" className='profile-picture' />
      </div>
      <div>
        <span className='greeting'>Hello Admin {/* Add name here */}</span>
      </div>
      <ul className="admin-menu">
        <li onClick={() => !usersActive && handleToggleUsers()} className={usersActive ? 'active' : ''}>
          <FaUserAlt />
          <span>Users</span>
        </li>
        <li onClick={() => !projectsActive && handleToggleProjects()} className={projectsActive ? 'active' : ''}>
          <LuFolderTree />
          <span>Projects</span>
        </li>
      </ul>
    </div>
  );
};

export default AdminMenu;
