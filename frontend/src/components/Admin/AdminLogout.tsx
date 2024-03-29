import "./AdminLogout.scss";
import { FiLogOut } from "react-icons/fi";



const AdminLogout = () => {
  return (
    <div className="admin-logout">
      <div className="logout-btn">
        <FiLogOut size={20} />
      </div>
    </div>
  )
}

export default AdminLogout