// Libraries
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// Icons
import { MdLogout } from "react-icons/md";
// Files
import defaultProfilePicture from "../../assets/default-profile-picture.png";
// Styles
import "./UserModal.scss";
// Hooks
import { useUser } from "../../hooks/UserContext";
// API
import { api } from "../../api";

interface Props {}

const UserModal = ({}: Props) => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [profileIsOpen, setProfileIsOpen] = useState<boolean>(false);

  const handleShowProfile = () => setProfileIsOpen(true);

  const closeModal = () => setProfileIsOpen(false);

  const handleLogout = async () => {
    // try {
    //   const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/users/logout`, {
    //     method: "POST",
    //     credentials: "include",
    //   });

    //   if (response.ok) {
    //     setUser(null);
    //     navigate("/login");
    //   } else {
    //     const errorData = await response.json();
    //     console.error("Logout failed: ", errorData);
    //   }
    // } catch (error) {
    //   console.error("Failed to logout: ", error);
    // }

    try {
      const response = await api.post("/users/logout");
      if (response.data.message === 'Logged out') {
        setUser(null);
        navigate("/login");
      } else {
        console.error("Logout failed: ", response.data);
      }
    } catch (error) {
      console.error("Failed to logout: ", error);
    }
  };

  // Backdrop styling
  useEffect(() => {
    profileIsOpen ? (document.body.classList.add("userModal-open")) : (document.body.classList.remove("userModal-open"));
  }, [profileIsOpen]);

  return (
    <>
      {user && (
        <>
          <div className="user-avatar">
            <img
              src={user.profilePicture || defaultProfilePicture}
              alt="User Avatar"
              onClick={handleShowProfile}
            />
          </div>

          <Modal
            show={profileIsOpen}
            onHide={closeModal}
            dialogClassName="user-info-modal"
          >
            <Modal.Header className="header" closeButton>
              <img
                src={user.profilePicture || defaultProfilePicture}
                alt="User Avatar"
              />

              <h2>Hi, {user.name}!</h2>
            </Modal.Header>

            <Modal.Body>
              <p>Username: {user.username}</p>
              <p>Email address: {user.email}</p>
            </Modal.Body>

            <Modal.Footer>
              <button className="btn-logout" onClick={handleLogout}>
                <MdLogout size={20} />
                Sign Out
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default UserModal;
