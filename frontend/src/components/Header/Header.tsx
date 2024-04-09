// Icons
import { FaHandshakeSimple } from "react-icons/fa6";
// Libraries
import { Link } from "react-router-dom";
// Components
import UserModal from "../Modals/UserModal/UserModal";
import SearchBar from "./SearchBar";
// Styles
import "./Header.scss";

// Todo:
// Display search results from backend
// User profile picture fetched from backend

interface Props {
  searchPlaceholder: string;
}

const Header = ({ searchPlaceholder }: Props) => {
  return (
    <header>
      <Link to={"/projects"} className="">
        <h1 className="logo">
          <FaHandshakeSimple />
          CollabHub
        </h1>
      </Link>

      <SearchBar placeholder={searchPlaceholder} />

      <UserModal />
    </header>
  );
};

export default Header;
