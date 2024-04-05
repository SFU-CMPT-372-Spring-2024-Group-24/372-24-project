import defaultProfilePicture from '../../assets/default-profile-picture.png';
import React from 'react';
import './AdminMenu.scss';
import { LuUsers } from "react-icons/lu";
import { LuFolderTree } from "react-icons/lu";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { useUser } from "../../hooks/UserContext";

interface AdminMenuProps {
  toggleUsers: () => void;
  toggleProjects: () => void;
  toggleDashboard: () => void;
  usersActive: boolean;
  projectsActive: boolean;
  dashboardActive: boolean;
}

const AdminMenu: React.FC<AdminMenuProps> = ({ toggleUsers, toggleProjects, toggleDashboard, usersActive, projectsActive, dashboardActive }) => {
  const { user } = useUser(); 

  return (
    <div className='admin-menu-container'>
      <div className='profile'>
        <img src={defaultProfilePicture} alt="Profile" className='profile-picture' />
      </div>
      <div className='greeting-container'>
        <span className='greeting'>Hello {user ? user.name : ''}</span>

      </div>
      <ul className="admin-menu">
        <li onClick={toggleDashboard} className={dashboardActive ? 'active' : ''}>
          <MdOutlineSpaceDashboard />
          <span className='list'>Dashboard</span>
        </li>
        <li onClick={toggleUsers} className={usersActive ? 'active' : ''}>
          <LuUsers />
          <span className='list'>Users</span>
        </li>
        <li onClick={toggleProjects} className={projectsActive ? 'active' : ''}>
          <LuFolderTree />
          <span className='list'>Projects</span>
        </li>
      </ul>
    </div>
  );
};

export default AdminMenu;
