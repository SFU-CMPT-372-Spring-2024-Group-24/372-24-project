// Hooks
import { useState } from "react";
import { useUser } from "../../hooks/UserContext";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";
// API
import { api, AxiosError } from "../../api";
import UpdateAccountModal from "../Modals/UpdateAcountModal/UpdateAccountModal";

interface Props {
}

const AccountView = ({  }: Props) => {
  const { user, setUser } = useUser();
  const [action, setAction] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const { handleApiFormError } = useApiErrorHandler();

  if (!user) {
    return null;
  }

  const handleOpenModal = (action: string) => {
    setAction(action);
    setShowModal(true);
  };

  return (
    <>
      <h2>Account settings</h2>

      <div>
        <h3>Change name</h3>
        <p>Current name: {user.name}</p>
        <button
          type="button"
          className="btn-text-secondary"
          onClick={() => handleOpenModal("name")}
        >
          Change
        </button>
      </div>

      <div>
        <h3>Change username</h3>
        <p>Current username: {user.username}</p>
        <button
          type="button"
          className="btn-text-secondary"
          onClick={() => handleOpenModal("username")}
        >
          Change
        </button>
      </div>

      <div>
        <h3>Change email</h3>
        <p>Current email: {user.email}</p>
        <button
          type="button"
          className="btn-text-secondary"
          onClick={() => handleOpenModal("email")}
        >
          Change
        </button>
      </div>

      <div>
        <h3>Update password</h3>
        <button
          type="button"
          className="btn-text-secondary"
          onClick={() => handleOpenModal("password")}
        >
          Update
        </button>
      </div>

      <UpdateAccountModal showModal={showModal} setShowModal={setShowModal} action={action} />
    </>
  );
};

export default AccountView;