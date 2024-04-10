// Files
import defaultProfilePicture from "../../assets/default-profile-picture.png";
// Models
import { User } from "../../models/User";
// Libraries
import moment from "moment";
// Icons
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
// Hooks
import { useUser } from "../../hooks/UserContext";
import { useEffect } from "react";

interface Props {
  view: string;
  setView: (view: string) => void;
  isOwnProfile: boolean;
  profile: User;
  setProfile: (profile: User) => void;
}
const ProfilePanel = ({ view, setView, isOwnProfile, profile, setProfile }: Props) => {
  const { user } = useUser();

  // If the profile is the user's own profile, set the profile to the user
  useEffect(() => {
    if (user && isOwnProfile) setProfile(user);
  }, [user, isOwnProfile]);

  return (
    <>
      <section className="profile-panel">
        {/* Profile info */}
        <div className="profile-info">
          <img
            src={profile.profilePicture || defaultProfilePicture}
            alt="User Avatar"
          />

          <h2 className="gradient-text">{profile.name}</h2>

          <p className="username">
            <AiOutlineUser size={18} />
            {profile.username}
          </p>

          <p>
            <HiOutlineMail size={18} />
            {profile.email}
          </p>

          <p>Joined on {moment(profile.createdAt).format("MMMM Do, YYYY")}</p>
        </div>

        {/* Profile navigation */}
        <div className="profile-nav">
          {isOwnProfile && (
            <>
              {/* <button
                className={view === "activity" ? "active" : ""}
                onClick={() => setView("activity")}
              >
                Activity
              </button> */}

              <button
                className={view === "editProfile" ? "active" : ""}
                onClick={() => setView("editProfile")}
              >
                Account
              </button>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default ProfilePanel;
