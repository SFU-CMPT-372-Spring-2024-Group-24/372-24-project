// Libraries
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Draggable } from "@hello-pangea/dnd";
// Styles
import "./TaskItem.scss";
// Icons
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { TbArrowsExchange } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa6";
// Utils
// import { priorities } from "../../../utils/priorityColorUtils";
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
// API
import { api, AxiosError } from "../../../api";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";

interface Props {
  list: List;
  task: Task;
  index: number;
}

const TaskItem = ({ list, task, index }: Props) => {
  const {handleApiError} = useApiErrorHandler();
  const [showTaskItemModal, setShowTaskItemModal] = useState<boolean>(false);
  const [showMoveTaskModal, setShowMoveTaskModal] = useState<boolean>(false);
  const { project, removeTask, userCanPerform } = useTasks();
  // const priorityColor = priorities.find(
  //   (p) => p.value === task.priority
  // )?.color;

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
        toast(response.data.message);
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  return (
    <>
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <li
            className="task-item"
            onClick={toggleTaskItemModal}
            // style={{ borderColor: priorityColor }}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <h3>{task.name}</h3>

            {task.dueDate && (
              <div className="info">
                <div className="due-date">
                  <FaRegClock size={12} />
                  {moment(task.dueDate).format("MMM D hh:mma")}
                </div>
              </div>
            )}
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
                  onClick={handleDeleteTask}
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

      <MoveTaskModal
        list={list}
        index={index}
        showModal={showMoveTaskModal}
        setShowModal={setShowMoveTaskModal}
        setShowTaskItemModal={setShowTaskItemModal}
      />
    </>
  );
};

export default TaskItem;
