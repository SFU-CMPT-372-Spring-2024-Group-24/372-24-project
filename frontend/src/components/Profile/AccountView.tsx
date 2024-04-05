// Hooks
import { useState } from "react";
import { useUser } from "../../hooks/UserContext";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";
// Libraries
import Modal from "react-bootstrap/Modal";
// API
import { api, AxiosError } from "../../api";

interface Props {
}

const AccountView = ({  }: Props) => {
  const { user, setUser } = useUser();
  const [action, setAction] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const { handleApiFormError } = useApiErrorHandler();
  const [newUsername, setNewUsername] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  if (!user) {
    return null;
  }

  const handleCloseModal = () => setShowModal(false);

  const handleOpenModal = (action: string) => {
    setAction(action);
    setShowModal(true);
  };

  const handleManageAccount = async () => {
    if (action === "username") {
      try {
        const response = await api.put("/users", {
          username: newUsername,
        });

        setUser(response.data.user);
      } catch (error) {
        setErrorMsg(handleApiFormError(error as AxiosError));
      }
    } 
  }

  return (
    <>
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
        <h3>Change password</h3>

        <button
          type="button"
          className="btn-text-secondary"
          onClick={() => handleOpenModal("password")}
        >
          Change
        </button>
      </div>

      <Modal 
      show={showModal} 
      onHide={handleCloseModal}
      centered
      dialogClassName="account-modal"
      backdropClassName="account-modal-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Change {action}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          {action === "username" && (
            <div>
              <label htmlFor="new-username">New username:</label>
              <input
                type="text"
                id="new-username"
                name="new-username"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
          )}

          {action === "email" && (
            <div>
              <label htmlFor="new-email">New email:</label>
              <input
                type="email"
                id="new-email"
                name="new-email"
                placeholder="Enter new email"
              />
            </div>
          )}

          {action === "password" && (
            <div>
              <label htmlFor="new-password">New password:</label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                placeholder="Enter new password"
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="button-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-text"
              onClick={handleManageAccount}
            >
              Save changes
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AccountView;