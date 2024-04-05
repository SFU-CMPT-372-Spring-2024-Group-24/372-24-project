// Hooks
import { useUser } from "../../hooks/UserContext";
// Files
import defaultProfilePicture from "../../assets/default-profile-picture.png";

interface Props {
  view: string;
  setView: (view: string) => void;
}
const ProfilePanel = ({ view, setView }: Props) => {
  const { user } = useUser();

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
    </>
  );
};

export default ProfilePanel;
