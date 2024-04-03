import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import './AdminLogout.scss';
import { useUser } from '../../hooks/UserContext'; 

const AdminLogout = () => {
  const navigate = useNavigate();
  const { setUser } = useUser(); 

  const handleLogout = async () => {
    try {
      const response = await api.post("/users/logout");
      if (response.data.loggedOut) {
        setUser(null); 
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to logout: ", error);
    }
  };

  return (
    <div className="admin-logout" onClick={handleLogout}>
      <div className="logout-btn">
        <FiLogOut size={20} />
      </div>
    </div>
  );
};

export default AdminLogout;
