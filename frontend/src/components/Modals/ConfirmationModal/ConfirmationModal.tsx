// Libraries
import Modal from "react-bootstrap/Modal";
// Icons and styles
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import "./ConfirmationModal.scss";

interface Props {
  show: boolean;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({
  show,
  message,
  confirmText,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal
      show={show}
      onHide={onCancel}
      dialogClassName="confirmation-modal"
      backdropClassName="confirmation-modal-backdrop"
      centered
      animation={false}
    >
      <Modal.Header>
        <Modal.Title>
          <BsFillExclamationCircleFill size={20} />
          Please confirm
        </Modal.Title>
        {/* <IoMdClose size={20} onClick={onCancel}/> */}
        <button className="btn-icon" onClick={onCancel}>
          <IoMdClose size={22} />
        </button>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <div className="button-group">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            {confirmText || "Confirm"}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
