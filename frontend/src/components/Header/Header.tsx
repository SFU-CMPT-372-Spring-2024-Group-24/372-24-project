import { IoSearch } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";

import "./Header.scss";

// Header contains the logo on the left, search bar in the middle, and user profile on the right
const Header = () => {
  return (
    <header>
      <h1 className="logo">
        <FaHandshakeSimple />
        CollabHub
      </h1>

      <div className="search-bar">
        <IoSearch size={20} className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <div className="user-profile">
        <div className="dropdown">
          <img
            src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User Avatar"
          />

          <div className="dropdown-content">
            <h3>John Doe</h3>
            <p>
              <a href="/">Logout</a>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
