// Hooks
import { useState } from "react";
import { useUser } from "../../../hooks/UserContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
// Components
import UpdateAccountModal from "../../Modals/UpdateAcountModal/UpdateAccountModal";
import AddProfilePictureModal from "../../Modals/AddProfilePictureModal";
// Styles
import "./AccountView.scss";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// API
import { api, AxiosError } from "../../../api";
// Libraries
import { toast } from "react-toastify";

interface Props {}

const AccountView = ({}: Props) => {
  const { user, setUser } = useUser();
  const [action, setAction] = useState<string>("");
  const [showUpdateAccountModal, setShowUpdateAccountModal] =
    useState<boolean>(false);
  const [showAddProfilePictureModal, setShowAddProfilePictureModal] =
    useState<boolean>(false);
  const { handleApiError } = useApiErrorHandler();

  if (!user) {
    return null;
  }

  const handleOpenModal = (action: string) => {
    setAction(action);
    setShowUpdateAccountModal(true);
  };

  const handleRemoveProfilePicture = async () => {
    try {
      await api.delete("/users/me/profile-picture");
      setUser({ ...user, profilePicture: "" });
      toast.success("Profile picture removed successfully");
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  return (
    <>
      <section className="account-view">
        <h2>Account settings</h2>

        <div className="account-field profilePicture">
          <h3>Profile picture</h3>
          <img
            src={user.profilePicture || defaultProfilePicture}
            alt="User Avatar"
          />
          <button
            className="btn-text-secondary"
            onClick={() => setShowAddProfilePictureModal(true)}
          >
            Update profile picture
          </button>
          <button
            className="btn-text-secondary"
            onClick={handleRemoveProfilePicture}
          >
            Remove profile picture
          </button>
        </div>

        <div className="account-field">
          <button
            type="button"
            className="btn-text-secondary btn-float-right"
            onClick={() => handleOpenModal("name")}
          >
            Change name
          </button>
          <h3>Name</h3>
          <p>{user.name}</p>
        </div>

        <div className="account-field">
          <button
            type="button"
            className="btn-text-secondary btn-float-right"
            onClick={() => handleOpenModal("username")}
          >
            Change username
          </button>
          <h3>Username</h3>
          <p>{user.username}</p>
        </div>

        <div className="account-field">
          <button
            type="button"
            className="btn-text-secondary btn-float-right"
            onClick={() => handleOpenModal("email")}
          >
            Change email
          </button>
          <h3>Email address</h3>
          <p>{user.email}</p>
        </div>

        <div className="account-field">
          <h3>Password</h3>
          <button
            type="button"
            className="btn-text-secondary"
            onClick={() => handleOpenModal("password")}
          >
            Update password
          </button>
        </div>
      </section>

      <UpdateAccountModal
        showModal={showUpdateAccountModal}
        setShowModal={setShowUpdateAccountModal}
        action={action}
      />

      <AddProfilePictureModal
        showAddProfilePictureModal={showAddProfilePictureModal}
        setShowAddProfilePictureModal={setShowAddProfilePictureModal}
      />
    </>
  );
};

export default AccountView;
