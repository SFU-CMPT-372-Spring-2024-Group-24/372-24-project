// Hooks
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
import { useState } from "react";
// Components
import ProfilePanel from "../../components/Profile/ProfilePanel";
import AccountView from "../../components/Profile/AccountView/AccountView";
import ActivityView from "../../components/Profile/ActivityView";
// Styles
import "./ProfilePage.scss";

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useUser();
  const [view, setView] = useState<string>("activity");

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <ProfilePanel view={view} setView={setView} />

      <section className="profile-main-view">
        {view === "activity" && <ActivityView />}

        {view === "editProfile" && <AccountView />}
      </section>
    </div>
  );
};

export default ProfilePage;
