// Libraries
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { toast } from "react-toastify";
import { Draggable } from "@hello-pangea/dnd";
// Icons and styles
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { TbArrowsExchange } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa6";
import "./TaskItem.scss";
// Models
import { Task } from "../../../models/Task";
import { List } from "../../../models/List";
// Components
import Priority from "./Priority";
import Description from "./Description";
import DueDate from "./DueDate";
import Comments from "./Comments";
import TaskMembers from "./TaskMembers";
import TaskName from "./TaskName";
import Attachments from "./Attachments";
import MoveTaskModal from "../../Modals/MoveTask/MoveTaskModal";
import ConfirmationModal from "../../Modals/ConfirmationModal/ConfirmationModal";
// API
import { api, AxiosError } from "../../../api";
// Hooks
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
import { useState } from "react";

interface Props {
  list: List;
  task: Task;
  index: number;
}

const TaskItem = ({ list, task, index }: Props) => {
  // Error handling
  const { handleApiError } = useApiErrorHandler();
  // Task Item Modal
  const [showTaskItemModal, setShowTaskItemModal] = useState<boolean>(false);
  // Move Task Modal
  const [showMoveTaskModal, setShowMoveTaskModal] = useState<boolean>(false);
  // Task Context
  const { project, removeTask, userCanPerform } = useTasks();
  // Confirmation modal for deleting a task
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);

  // Toggle Task Item Modal visibility
  const toggleTaskItemModal = () => setShowTaskItemModal(!showTaskItemModal);

  // Open Move Task Modal
  const openMoveTaskModal = () => setShowMoveTaskModal(true);

  // Delete Task
  const handleDeleteTask = async () => {
    try {
      const response = await api.delete(`/tasks/${task.id}`, {
        data: { projectId: project.id },
      });

      if (response.status === 200) {
        removeTask(list.id, task.id);
        setShowTaskItemModal(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  return (
    <>
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <li
            className="task-item"
            onClick={toggleTaskItemModal}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <h3>{task.name}</h3>

            <div className="info">
              <div className="due-date">
                {task.dueDate && (
                  <>
                    <FaRegClock size={12} />
                    {moment(task.dueDate).format("MMM D hh:mma")}
                  </>
                )}
              </div>

              {task.priority && task.priority !== "unset" && (
                <div className={`priority priority-${task.priority}`}>
                  {task.priority}
                </div>
              )}
            </div>
          </li>
        )}
      </Draggable>

      <Modal
        show={showTaskItemModal}
        onHide={toggleTaskItemModal}
        dialogClassName="task-item-modal"
      >
        <Modal.Header className="header">
          <TaskName task={task} />

          <div className="sub-header">
            <span
              className={`
                list-name 
                ${task.priority && "hasPriority"}
                ${userCanPerform("manageTasks") && "hasPriority"}
              `}
            >
              {list.name}
            </span>
            <Priority task={task} />
          </div>

          <div className="button-group">
            <button
              className="btn-icon close-btn"
              onClick={toggleTaskItemModal}
            >
              <IoMdClose size={20} />
            </button>
            {userCanPerform("manageTasks") && (
              <>
                <button
                  className="btn-icon move-btn"
                  onClick={openMoveTaskModal}
                >
                  <TbArrowsExchange size={20} />
                </button>

                <button
                  className="btn-icon delete-btn"
                  onClick={() => setShowConfirmationModal(true)}
                >
                  <IoMdTrash size={20} />
                </button>
              </>
            )}
          </div>
        </Modal.Header>

        <Modal.Body>
          <Description task={task} />
          <DueDate task={task} />
          <div className="row">
            <TaskMembers task={task} />
            <Attachments task={task} />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Comments task={task} />
        </Modal.Footer>
      </Modal>

      {/* Move task modal */}
      <MoveTaskModal
        list={list}
        index={index}
        showModal={showMoveTaskModal}
        setShowModal={setShowMoveTaskModal}
        setShowTaskItemModal={setShowTaskItemModal}
      />

      {/* Confirmation modal for deleting a task */}
      <ConfirmationModal
        show={showConfirmationModal}
        message="Are you sure you want to delete this task?"
        secondMessage="All comments will be lost."
        confirmText="Delete"
        onConfirm={handleDeleteTask}
        onCancel={() => setShowConfirmationModal(false)}
      />
    </>
  );
};

export default TaskItem;
