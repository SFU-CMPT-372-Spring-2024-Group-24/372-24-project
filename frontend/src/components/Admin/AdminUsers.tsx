import "./AdminUsers.scss";
import { useState, useEffect } from 'react';
import { api } from '../../api';

const AdminUsers = () => {

  const [users, setUsers] = useState<any[]>([]);
  const [userIDArray, setUserIDArray] = useState<string[]>([]);

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

    fetchUsers();

  }, [userIDArray]);

  //need to fix: delete all data associated with user (ex. projects, chats)
  const deleteUser = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      setUserIDArray(userIDArray.filter((id) => id !== userId));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  return (

    <div>
      <h2>All Users In Database</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminUsers