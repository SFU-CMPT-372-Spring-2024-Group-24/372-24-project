import { useState, useEffect } from 'react';
import { useBackendAPI } from '../../hooks/BackendAPI';

const Adminpage = () => {
    const backendAPI = useBackendAPI();
    const [users, setUsers] = useState<any[]>([]); 
    

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await backendAPI('/users');
                const userData = await response.json();
                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Admin Page</h1>

            <h2>All Users In Database</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Adminpage;