// Hooks
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
import { useEffect, useState } from "react";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";
// Components
import ProfilePanel from "../../components/Profile/ProfilePanel";
import AccountView from "../../components/Profile/AccountView/AccountView";
import ActivityView from "../../components/Profile/ActivityView";
// Styles
import "./ProfilePage.scss";
// API
import { api, AxiosError } from "../../api";
// Models
import { User } from "../../models/User";

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const [view, setView] = useState<string>("activity");
  const { handleApiError } = useApiErrorHandler();

  useEffect(() => {
    // Check if the profile page is the user's own profile
    if (user && user.username === username) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [user, username]);

  // Fetch the user's profile
  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/${username}`);
        setProfile(response.data.user);
      } catch (error) {
        handleApiError(error as AxiosError);
      }
    };

    fetchProfile();
  }, [username]);

  return (
    <>
      {profile && (
        <div className="profile-page">
          <ProfilePanel
            view={view}
            setView={setView}
            isOwnProfile={isOwnProfile}
            profile={profile}
          />

          <section className="profile-main-view">
            {view === "activity" && <ActivityView />}

            {isOwnProfile && view === "editProfile" && <AccountView />}
          </section>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
