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

  const deleteUser = async (userId: string) => {
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

  return (
    <div className="admin-users-container">
      <h2>All Users In Database</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-header">
              <span className="user-name">{user.username}</span>
              <div className="action-buttons">
                <button onClick={() => toggleMoreInfo(user.id)}>{user.showEmail ? "Less" : "More"}</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </div>
            </div>
            {user.showEmail && (
              <div className="user-more-info">
                {user.name && <p>{user.name}</p>}
                {user.email && <p>{user.email}</p>}
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
