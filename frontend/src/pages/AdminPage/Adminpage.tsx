import { useState } from 'react';
import './Adminpage.scss';
import AdminMenu from '../../components/Admin/AdminMenu';
import AdminLogout from '../../components/Admin/AdminLogout';
import AdminUsers from '../../components/Admin/AdminUsers';
import AdminProjects from '../../components/Admin/AdminProjects';
import AdminDashboard from '../../components/Admin/AdminDashboard';

const AdminPage = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);

  const toggleUsers = () => {
    setShowUsers(!showUsers);
    setShowProjects(false);
    setShowDashboard(false);
  };

  const toggleProjects = () => {
    setShowProjects(!showProjects);
    setShowUsers(false);
    setShowDashboard(false);
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard);
    setShowUsers(false);
    setShowProjects(false);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-menu-container">
        <AdminMenu toggleUsers={toggleUsers} toggleProjects={toggleProjects} toggleDashboard={toggleDashboard} />
      </div>
      <div className="admin-content-container">
        <div className="admin-logout-container">
          <AdminLogout />
        </div>
        <div className="admin-content">
          {showUsers && <AdminUsers />}
          {showProjects && <AdminProjects />}
          {showDashboard && <AdminDashboard />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
