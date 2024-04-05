// Hooks
import { useState } from "react";
import { useUser } from "../../../hooks/UserContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
// Libraries
import Modal from "react-bootstrap/Modal";
// API
import { api, AxiosError } from "../../../api";
// Icons and styles
import { BsFillExclamationCircleFill } from "react-icons/bs";
import "./UpdateAccountModal.scss";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  action: string;
}

interface AccountData {
  username?: string;
  email?: string;
  name?: string;
  oldPassword?: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
}

const UpdateAccountModal = ({ showModal, setShowModal, action }: Props) => {
  const { user, setUser } = useUser();
  if (!user) {
    return null;
  }

  const { handleApiFormError } = useApiErrorHandler();
  const [newName, setNewName] = useState<string>(user.name);
  const [newUsername, setNewUsername] = useState<string>(user.username);
  const [newEmail, setNewEmail] = useState<string>(user.email);
  const [oldPw, setOldPw] = useState<string>("");
  const [newPw, setNewPw] = useState<string>("");
  const [newPwConfirm, setNewPwConfirm] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleCloseModal = () => {
    setOldPw("");
    setNewPw("");
    setNewPwConfirm("");
    setShowModal(false);
    setErrorMsg("");
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: AccountData = {};

    if (action === "name") {
      data.name = newName;
    }

    if (action === "username") {
      data.username = newUsername;
    }

    if (action === "email") {
      data.email = newEmail;
    }

    if (action === "password") {
      if (!oldPw || !newPw || !newPwConfirm) {
        setErrorMsg("Please fill in all fields");
        return;
      }

      if (newPw !== newPwConfirm) {
        setErrorMsg("New passwords do not match");
        return;
      }

      data.oldPassword = oldPw;
      data.newPassword = newPw;
      data.newPasswordConfirmation = newPwConfirm;
    }

    try {
      const response = await api.put("/users/me", data);
      setUser(response.data.user);
      setNewName(response.data.user.name);
      setNewUsername(response.data.user.username);
      setNewEmail(response.data.user.email);
      handleCloseModal();
    } catch (err) {
      setErrorMsg(handleApiFormError(err as AxiosError));
    }
  };

  return (
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
        {errorMsg && (
          <div className="error-msg">
            <BsFillExclamationCircleFill size={18} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleUpdateAccount}>
          {action === "name" && (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
          )}

          {action === "username" && (
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              autoFocus
            />
          )}

          {action === "email" && (
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              autoFocus
            />
          )}

          {action === "password" && (
            <>
              <div className="input-field">
                <label htmlFor="oldPw">Old password</label>
                <input
                  type="password"
                  id="oldPw"
                  value={oldPw}
                  onChange={(e) => setOldPw(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="input-field">
                <label htmlFor="newPw">New password</label>
                <input
                  type="password"
                  id="newPw"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
              </div>

              <div className="input-field">
                <label htmlFor="newPwConfirm">Confirm new password</label>
                <input
                  type="password"
                  id="newPwConfirm"
                  value={newPwConfirm}
                  onChange={(e) => setNewPwConfirm(e.target.value)}
                />
              </div>
            </>
          )}
          
          <div className="button-group">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-text"
              onClick={handleUpdateAccount}
            >
              Save changes
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateAccountModal;
