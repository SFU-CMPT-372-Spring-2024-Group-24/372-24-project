// Hooks
import { useUser } from "../../hooks/UserContext";
import { useState } from "react";
// Files
import defaultProfilePicture from "../../assets/default-profile-picture.png";
// Components
import AddProfilePictureModal from "../Modals/AddProfilePictureModal";

interface Props {
  view: string;
  setView: (view: string) => void;
}
const ProfilePanel = ({ view, setView }: Props) => {
  const { user } = useUser();
  const [showAddProfilePictureModal, setShowAddProfilePictureModal] = useState<boolean>(false);

  if (!user) {
    return null;
  }

  return (
    <>
      <section className="profile-panel">
        <div className="profile-info">
          <img
            src={user.profilePicture || defaultProfilePicture}
            alt="Profile"
          />

          <button
            className="btn-text-secondary"
            onClick={() => setShowAddProfilePictureModal(true)}
          >
            Change profile picture
          </button>

          <h2 className="gradient-text">{user.name}</h2>
          
          <p className="username">
            <span>Username: </span>
            {user.username}
          </p>

          <p>
            <span>Email address: </span>
            {user.email}
          </p>
        </div>

        {/* simple check on views */}
        <div className="profile-nav">
          <button
            className={view === "activity" ? "active" : ""}
            onClick={() => setView("activity")}
          >
            Activity
          </button>
          <button
            className={view === "editProfile" ? "active" : ""}
            onClick={() => setView("editProfile")}
          >
            Account
          </button>
        </div>
      </section>

      <AddProfilePictureModal
        showAddProfilePictureModal={showAddProfilePictureModal}
        setShowAddProfilePictureModal={setShowAddProfilePictureModal}
      />
    </>
  );
};

export default ProfilePanel;
