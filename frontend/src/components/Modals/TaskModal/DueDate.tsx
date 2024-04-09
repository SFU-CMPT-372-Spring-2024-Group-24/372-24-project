// Libraries
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import ReactDatePicker from "react-datepicker";
import { toast } from "react-toastify";
// Models
import { Task } from "../../../models/Task";
// API
import { api, AxiosError } from "../../../api";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
// Styles
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  task: Task;
}

const DueDate = ({ task }: Props) => {
  const [showDueDateModal, setShowDueDateModal] = useState<boolean>(false);
  const dueDateRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(task.dueDate);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { setTask, project, userCanPerform } = useTasks();
  const {handleApiError} = useApiErrorHandler();

  // For opening the modal
  const openDueDateModal = () => {
    if (!userCanPerform("manageTasks")) return;
    setShowDueDateModal(true);
  };

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
  const handleTaskDoneChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!userCanPerform("manageTasks")) {
      toast.error("You do not have permission to manage tasks");
      return;
    }

    const isDone = event.target.checked;

    try {
      const response = await api.put(`/tasks/${task.id}`, {
        isDone,
        projectId: project.id,
      });

      setTask({ ...task, isDone: response.data.isDone });
      setErrorMsg("");
    } catch (error) {
      handleApiError(error as AxiosError);
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
      const response = await api.put(`/tasks/${task.id}`, {
        dueDate: selectedDate,
        projectId: project.id,
      });

      setTask({ ...task, dueDate: response.data.dueDate });
      setErrorMsg("");
      setShowDueDateModal(false);
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  return (
    <>
      <div ref={dueDateRef} className="due-date">
        <h4>Due date</h4>

        <div className="check-due-date">
          {task.dueDate && (
            <>
              <input
                type="checkbox"
                name="isDone"
                id="isDone"
                checked={task.isDone}
                onChange={handleTaskDoneChange}
                disabled={!userCanPerform("manageTasks")}
              />
              <p
                className={`${userCanPerform("manageTasks") && "editable"}`}
                onClick={openDueDateModal}
              >
                {moment(task.dueDate).format("MMM D, yyyy hh:mmA")}
              </p>
            </>
          )}

          {/* If the user can manage tasks, and the dueDate is not set, show 'Set a due date' button*/}
          {!task.dueDate && userCanPerform("manageTasks") && (
            <button className="set-due-date" onClick={openDueDateModal}>
              Set a due date
            </button>
          )}

          {/* If the user cannot manage tasks, and the dueDate is not set, show 'None' */}
          {!task.dueDate && !userCanPerform("manageTasks") && (
            <p className="no-due-date">None</p>
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

            <ReactDatePicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onChange={(date: Date) => setSelectedDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time due"
              dateFormat="MMMM d, yyyy h:mm aa"
              inline
            />

            <div className="button-group">
              <button
                type="button"
                className="btn-cancel"
                onClick={closeDueDateModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => setSelectedDate(null)}
              >
                Clear due date
              </button>

              <button type="submit" className="btn-text">
                Save changes
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DueDate;
