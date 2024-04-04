// Hooks
import { useParams } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";

const ProfilePage = () => {
  const { username } = useParams();
  const { user } = useUser();
  
  return (
    <>
      <h1>Profile Page for {username}</h1>

      {user && user.username === username && (
        <p>This is your profile page</p>
      )}
    </>
  );
};

export default ProfilePage;