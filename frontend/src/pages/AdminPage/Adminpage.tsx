import { useState } from 'react';
import './Adminpage.scss';
import AdminMenu from '../../components/Admin/AdminMenu';
import AdminLogout from '../../components/Admin/AdminLogout';
import AdminUsers from '../../components/Admin/AdminUsers';
import AdminProjects from '../../components/Admin/AdminProjects';

const AdminPage = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const toggleUsers = () => {
    setShowUsers(!showUsers);
    setShowProjects(false);
  };

  const toggleProjects = () => {
    setShowProjects(!showProjects);
    setShowUsers(false);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-menu-container">
        <AdminMenu toggleUsers={toggleUsers} toggleProjects={toggleProjects} />
      </div>
      <div className="admin-content-container">
        <div className="admin-logout-container">
          <AdminLogout />
        </div>
        <div className='admin-header'>
          <h1>Welcome to the Admin Page</h1>
        </div>
        <div className="admin-content">
          {showUsers && <AdminUsers />}
          {showProjects && <AdminProjects />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
