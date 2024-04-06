// Icons
import { IoSearch } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
// Libraries
import { Link } from "react-router-dom";
// Components
import UserModal from "../Modals/UserModal/UserModal";
// Styles
import "./Header.scss";

// Todo:
// Display search results from backend
// User profile picture fetched from backend

const Header = () => {
  return (
    <header>
      <Link to={"/projects"} className="">
        <h1 className="logo">
          <FaHandshakeSimple />
          CollabHub
        </h1>
      </Link>

      <div className="search-bar">
        <IoSearch size={20} className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <UserModal />
    </header>
  );
};

export default Header;
