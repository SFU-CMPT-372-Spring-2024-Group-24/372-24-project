import { IoSearch } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

import "./Header.scss";
import { MdLogout } from "react-icons/md";

import { useUser } from "../../hooks/UserContext";

// Todo:
// Display search results from backend
// User profile picture fetched from backend

const Header = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUser();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/users/logout", {
        method: "POST",
      });

      if (response.ok) {
        setUser(null);
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Logout failed: ", errorData);
      }
    } catch (error) {
      console.error("Failed to logout: ", error);
    }
  };

  return (
    <header>
      <Link to={"/"} className="">
        <h1 className="logo">
          <FaHandshakeSimple />
          CollabHub
        </h1>
      </Link>

      <div className="search-bar">
        <IoSearch size={20} className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      {user && (
        <div className="user-profile">
          <div className="dropdown">
            <img
              src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User Avatar"
            />

            <div className="dropdown-content">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <button className="btn-logout" onClick={handleLogout}>
                <MdLogout size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
