import styles from "./Navbar.module.scss";
import Logo from "../../assets/handshakewhite.png";
import { IoMenu } from "react-icons/io5"; 
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  return (
    <header className={styles.navbar}>
      <nav className={styles.navbar_container + " " + styles.wrapper}>
        <a href="#" className={styles.navbar_logo} onClick={() => setShowNav(false)}>
          <img src={Logo} alt="logo" />
        </a>
        <ul className={showNav ? styles.show : ""}>
          <li onClick={() => setShowNav(false)}><a href="#">Product</a></li>
          <li onClick={() => setShowNav(false)}><a href="#">About</a></li>
          <li onClick={() => setShowNav(false)}><a href="#">Team</a></li>
          <li onClick={() => setShowNav(false)}><a href="#">Support</a></li>
        </ul>

        <div className={styles.navbar_btns}>
          <Link to="/login" className={styles["login-btn"]}>Login</Link> 
          <Link to="/login" className={styles["register-btn"]}>Register</Link>
        </div>

        <div className={styles.navbar_menu} onClick={() => setShowNav(!showNav)}>
          {showNav ? <IoMdClose color='white' size={24} /> : <IoMenu color='white' size={24}/>}
        </div>
      </nav>
    </header>
  )
}

export default Navbar