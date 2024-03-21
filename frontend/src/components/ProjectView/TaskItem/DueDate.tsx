// Libraries
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
// Models
import { Task } from "../../../models/Task";

interface Props {
  task: Task;
  setTask: (updatedTask: Task) => void;
}

const DueDate = ({ task, setTask }: Props) => {
  const [showDueDateModal, setShowDueDateModal] = useState<boolean>(false);
  const dueDateRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(task.dueDate);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // For opening the modal
  const openDueDateModal = () => setShowDueDateModal(true);

  // For closing the modal and cancelling the changes
  const closeDueDateModal = () => {
    setSelectedDate(task.dueDate);
    setShowDueDateModal(false);
  };

  // For positioning the modal
  useEffect(() => {
    if (showDueDateModal && dueDateRef.current) {
      const dueDateRect = dueDateRef.current.getBoundingClientRect();
      const modal = document.querySelector(".dueDate-modal");

      if (modal instanceof HTMLElement) {
        modal.style.top = `${dueDateRect.bottom}px`;
        modal.style.left = `${dueDateRect.left}px`;
      }
    }
  }, [showDueDateModal]);

  // For handling the change in the task's isDone property
  const handleTaskDoneChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isDone = event.target.checked;

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDone }),
      });

      if (response.ok) {
        setTask({ ...task, isDone });
        setErrorMsg("");
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.message);
      }
    } catch (error) {
      console.error("Error updating task done:", error);
      setErrorMsg("An error occurred while updating the task done status.");
    }
  };

  // For handling the change in the due date
  const handleDueDateChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDate === task.dueDate) {
      setShowDueDateModal(false);
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dueDate: selectedDate }),
      });

      if (response.ok) {
        setTask({ ...task, dueDate: selectedDate });
        setErrorMsg("");
        setShowDueDateModal(false);
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.message);
      }
    } catch (error) {
      console.error("Error updating due date:", error);
      setErrorMsg("An error occurred while updating the due date.");
    }
  };

  return (
    <>
      <div ref={dueDateRef} className="due-date">
        <h4>Due date</h4>

        <div className="check-due-date">
          {task.dueDate ? (
            <>
              <input
                type="checkbox"
                name="isDone"
                id="isDone"
                checked={task.isDone}
                onChange={handleTaskDoneChange}
              />
              <p onClick={openDueDateModal}>
                {moment(task.dueDate).format("MMM D, yyyy hh:mmA")}
              </p>
            </>
          ) : (
            <button className="set-due-date" onClick={openDueDateModal}>
              Set a due date
            </button>
          )}
        </div>
      </div>

      <Modal
        show={showDueDateModal}
        onHide={closeDueDateModal}
        dialogClassName="dueDate-modal"
        backdropClassName="task-subModal-backdrop"
      >
        <Modal.Header closeButton>
          <h4>Due date</h4>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleDueDateChange}>
            {errorMsg && <div className="error-msg">{errorMsg}</div>}

            <input
              id="dueDate"
              type="datetime-local"
              value={moment(selectedDate).format("YYYY-MM-DDTHH:mm")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />

            <div className="button-group">
              <button type="submit" className="btn-save">
                Save
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={closeDueDateModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DueDate;
