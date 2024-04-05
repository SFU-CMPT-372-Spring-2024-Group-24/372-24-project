// Libraries
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
// Models
import { Task, PriorityTypes } from "../../../models/Task";
// Utils
import { priorities } from "../../../utils/priorityColorUtils";
// API
import { api, AxiosError } from "../../../api";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";

interface Props {
  task: Task;
}

const Priority = ({ task }: Props) => {
  const [showPriorityModal, setShowPriorityModal] = useState<boolean>(false);
  const priorityRef = useRef<HTMLDivElement>(null);
  const [priorityValue, setPriorityValue] = useState<PriorityTypes>(
    task.priority || ""
  );
  const { setTask, project, userCanPerform } = useTasks();
  const handleApiError = useApiErrorHandler();

  // For toggling the modal
  const togglePriorityModal = () => setShowPriorityModal(!showPriorityModal);

  // For positioning the modal
  useEffect(() => {
    if (showPriorityModal && priorityRef.current) {
      const priorityRect = priorityRef.current.getBoundingClientRect();
      const modal = document.querySelector(".priority-modal");

      if (modal instanceof HTMLElement) {
        modal.style.top = `${priorityRect.bottom}px`;
        modal.style.left = `${priorityRect.left}px`;
      }
    }
  }, [showPriorityModal]);

  // For updating the priority
  const handlePriorityChange = async (priority: PriorityTypes) => {
    try {
      const response = await api.put(`/tasks/${task.id}`, {
        priority,
        projectId: project.id,
      });

      setTask({ ...task, priority: response.data.priority });
      setPriorityValue(response.data.priority);
      togglePriorityModal();
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  return (
    <>
      <div ref={priorityRef} className="priority">
        {task.priority && task.priority !== 'unset' && (
          <span
            className={`task-priority ${userCanPerform("manageTasks") ? "editable" : ""}`}
            onClick={() => {
              if (userCanPerform("manageTasks")) {
                togglePriorityModal();
              }
            }}
            style={{
              borderColor: priorities.find((p) => p.value === task.priority)?.color,
              backgroundColor: priorities.find((p) => p.value === task.priority)?.color,
            }}
          >
            {task.priority}
          </span>
        )}
        
        {!task.priority && userCanPerform("manageTasks") && (
          <button className="set-priority" onClick={togglePriorityModal}>
            Set priority
          </button>
        )}
      </div>

      <Modal
        show={showPriorityModal}
        onHide={togglePriorityModal}
        dialogClassName="priority-modal"
        backdropClassName="task-subModal-backdrop"
      >
        <Modal.Header closeButton>
          <h4>Priority</h4>
        </Modal.Header>

        <Modal.Body>
          <ButtonGroup>
            {priorities.map((priority, idx) => (
              <ToggleButton
                key={idx}
                id={`priority-${idx}`}
                type="radio"
                name="priority"
                value={priority.value}
                checked={priorityValue === priority.value}
                onChange={(e) => {
                  handlePriorityChange(e.currentTarget.value as PriorityTypes);
                }}
                style={{
                  backgroundColor:
                    priorityValue === priority.value ? priority.color : "",
                  borderRadius: "10px",
                }}
              >
                {priority.value}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Priority;
