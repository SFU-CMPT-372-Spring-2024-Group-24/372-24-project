// Libraries
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
// Styles
import "./ChangeMemberRoleModal.scss";
// Models
import { Role, Roles } from "../../models/ProjectRole";
import { User } from "../../models/User";
// API
import { AxiosError, api } from "../../api";
// Custom hooks
import { useTasks } from "../../hooks/TaskContext";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";
import { useUser } from "../../hooks/UserContext";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  member: User;
}

const ChangeMemberRoleModal = ({ showModal, setShowModal, member }: Props) => {
  if (!member) return null;

  const { project, projectMembers, setProjectMembers, setUserRole } = useTasks();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const handleApiError = useApiErrorHandler();
  const { user } = useUser();

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  // Update role
  const handleChangeRole = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      const response = await api.put(`/roles/${project.id}`, {
        targetUserId: member.id,
        roleId: selectedRole?.id,
      });

      if (response.status === 200) {
        const updatedMembers = projectMembers.map((m) => {
          if (m.id === member.id) {
            return {
              ...m,
              role: selectedRole,
            };
          }

          return m;
        });

        if (user!.id === member.id) {
          setUserRole(selectedRole);
        }

        setProjectMembers(updatedMembers);
        closeModal();
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={closeModal}
      dialogClassName="change-member-role-modal"
      backdropClassName="change-member-role-modal-backdrop"
      centered
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Change role</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="role-options">
          {Roles.map((role) => (
            <button
              key={role.id}
              className={`btn-icon ${
                selectedRole?.name === role.name ? "selected" : ""
              }`}
              onClick={() => setSelectedRole(role)}
              disabled={member.role?.name === role.name}
            >
              {role.name}
            </button>
          ))}
        </div>

        <div className="button-group">
          <button className="btn-cancel" onClick={closeModal}>
            Cancel
          </button>

          <button
            className="btn-text btn-save-changes"
            onClick={handleChangeRole}
            disabled={!selectedRole}
          >
            Save changes
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeMemberRoleModal;
