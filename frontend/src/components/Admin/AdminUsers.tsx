import "./AdminUsers.scss";
import { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminUsers = () => {

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const userData = response.data.map((user: any) => ({ ...user, showEmail: false, showName: false }));
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      alert('Cannot delete admin user');
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setUsers(users => users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const toggleMoreInfo = (userId: string) => {
    setUsers(users => {
      return users.map(user => {
        if (user.id === userId) {
          return { ...user, showEmail: !user.showEmail, showName: !user.showName };
        }
        return user;
      });
    });
  };

  const toggleAdminStatus = async (userId: string) => {
    try {
      //Check if user is the only admin
      const isAdminCount = users.filter(user => user.isAdmin).length;
      if (users.find(user => user.id === userId)?.isAdmin && isAdminCount === 1) {
        alert('Must have at least one Admin user.');
        return;
      }

      //Update isAdmin status
      const response = await api.patch(`/users/${userId}/toggleAdmin`);
      const updatedUser = response.data.user;

      setUsers(users => users.map(user => user.id === updatedUser.id ? { ...user, isAdmin: updatedUser.isAdmin } : user));
    } catch (error) {
      console.error('Error toggling admin status', error);
    }
  };

  return (
    <div className="admin-users-container">
      <h2>All Users In Database</h2>
      <ul className="user-list">
        <li className="title">Users:</li>
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-header">
              <span className="user-name">
                {user.username} {user.isAdmin && <span>(Admin)</span>}
              </span>
              <div className="action-buttons">
                <button
                  id="more-button"
                  onClick={() => toggleMoreInfo(user.id)}>
                  {user.showEmail ? "Less" : "More"}
                </button>
                <button
                  id="delete-button"
                  onClick={() => deleteUser(user.id, user.isAdmin)}>
                  Delete
                </button>
              </div>
            </div>
            {user.showEmail && (
              <div className="user-more-info">
                {user.name && <p>Name: {user.name}</p>}
                {user.email && (
                  <>
                    <p>Email: {user.email}</p>
                    <button 
                      onClick={() => toggleAdminStatus(user.id)} 
                      className="toggle-admin">
                      {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                    </button>
                  </>
                )}
                {!user.name && !user.email && <p>No additional information to display</p>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminUsers;
