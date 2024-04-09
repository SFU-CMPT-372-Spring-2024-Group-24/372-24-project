// Icons and Styles
import { IoChatbox } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import "./Header.scss";
// Libraries
import { Link } from "react-router-dom";
// Components
import UserModal from "../Modals/UserModal/UserModal";
import ChatList from "../Chat/ChatList/ChatList";
import SearchBar from "./SearchBar";
// Hooks
import { useState } from "react";

// Todo:
// Display search results from backend

interface Props {
  searchPlaceholder: string;
}

const Header = ({ searchPlaceholder }: Props) => {
  const [showChat, setShowChat] = useState<boolean>(false);
  
  return (
    <header>
      <Link to={"/projects"} className="">
        <h1 className="logo">
          <FaHandshakeSimple />
          CollabHub
        </h1>
      </Link>

      <SearchBar placeholder={searchPlaceholder} />

      <button
        type="button"
        className="btn-text"
        onClick={() => setShowChat(!showChat)}
      >
        <IoChatbox size={20}/>
      </button>

      <UserModal />

      <ChatList showChat={showChat} setShowChat={setShowChat} />
    </header> 
  );
};

export default Header;
