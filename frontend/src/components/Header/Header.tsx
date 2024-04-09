// Icons and Styles
import { IoChatbox, IoSearch } from "react-icons/io5";
import { FaHandshakeSimple } from "react-icons/fa6";
import "./Header.scss";
// Libraries
import { Link } from "react-router-dom";
// Components
import UserModal from "../Modals/UserModal/UserModal";
import ChatList from "../Chat/ChatList/ChatList";
// Hooks
import { useState } from "react";

// Todo:
// Display search results from backend

const Header = () => {
  const [showChat, setShowChat] = useState<boolean>(false);
  
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
