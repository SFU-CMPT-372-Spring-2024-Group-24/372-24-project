import defaultProfilePicture from '../../assets/default-profile-picture.png';
import "./AdminMenu.scss";
import { FaUserAlt } from "react-icons/fa";
import { LuFolderTree } from "react-icons/lu";


const AdminMenu = () => {
  return (
    <div className='admin-menu-container'>
      <div className='profile'>
        <img src={defaultProfilePicture} alt="Profile" className='profile-picture' />
      </div>
      <div>
        <span className='greeting'>Hello Admin {/* Add name here */}</span>
      </div>
      <ul className='admin-menu'>
        <li>
          <FaUserAlt />
          <a href='#'>Users</a>
        </li>
        <li>
          <LuFolderTree />
          <a href='#'>Projects</a>
        </li>
      </ul>
    </div>
  );
};

export default AdminMenu;
