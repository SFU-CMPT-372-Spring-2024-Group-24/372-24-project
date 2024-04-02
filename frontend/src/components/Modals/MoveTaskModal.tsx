// Libraries
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
// Models
import { List } from "../../models/List";
// Custom hooks
import { useTasks } from "../../hooks/TaskContext";
// Styles
import "./MoveTaskModal.scss";

interface Props {
  list: List;
  index: number;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  setShowTaskItemModal: (showModal: boolean) => void;
}

const MoveTaskModal = ({ list, index, showModal, setShowModal, setShowTaskItemModal  }: Props) => {
  const { lists, moveTask } = useTasks();
  const [selectedListId, setSelectedListId] = useState<number>(list.id);
  const [selectedPosition, setSelectedPosition] = useState<number>(index);
  
  // Close modal
  const closeModal = () => setShowModal(false);

  // Move task
  const handleMoveTask = async () => {
    try {
      const response = await moveTask(
        list.id,
        selectedListId,
        index,
        selectedPosition
      );

      if (response) {
        setShowTaskItemModal(false);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  return (
    <Modal
        show={showModal}
        onHide={closeModal}
        dialogClassName="move-task-modal"
        backdropClassName="task-subModal-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Move Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Current List: {list.name}</p>
          <p>Current Position: {index + 1}</p>

          <p>Select List:</p>
          <select
            value={selectedListId}
            onChange={(e) => {
              setSelectedListId(Number(e.target.value));
              setSelectedPosition(0);
            }}
          >
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          <p>Select Position:</p>
          {selectedListId && (
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
            >
              {lists
                .find((l) => l.id === selectedListId)
                ?.tasks.map((_, i) => (
                  <option key={i} value={i}>
                    {i + 1}
                  </option>
                ))}

              {selectedListId !== list.id && (
                <option
                  key={lists.find((l) => l.id === selectedListId)?.tasks.length}
                  value={
                    lists.find((l) => l.id === selectedListId)?.tasks.length
                  }
                >
                  {lists.find((l) => l.id === selectedListId)!.tasks.length + 1}
                </option>
              )}
            </select>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button className="btn-cancel" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn-text" onClick={handleMoveTask}>
            Move Task
          </button>
        </Modal.Footer>
      </Modal>
  );
};

export default MoveTaskModal;