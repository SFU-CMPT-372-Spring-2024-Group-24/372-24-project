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
// API
import { api } from "../../../api";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";

interface Props {
  list: List;
  task: Task;
  index: number;
}

const TaskItem = ({ list, task, index }: Props) => {
  const [showTaskItemModal, setShowTaskItemModal] = useState<boolean>(false);
  const [showMoveTaskModal, setShowMoveTaskModal] = useState<boolean>(false);
  const { lists, moveTask, removeTask } = useTasks();
  const [selectedListId, setSelectedListId] = useState<number>(list.id);
  const [selectedPosition, setSelectedPosition] = useState<number>(index);
  // const priorityColor = priorities.find(
  //   (p) => p.value === task.priority
  // )?.color;

  // Toggle Task Item Modal visibility
  const toggleTaskItemModal = () => setShowTaskItemModal(!showTaskItemModal);

  // Toggle Move Task Modal visibility
  const toggleMoveTaskModal = () => setShowMoveTaskModal(!showMoveTaskModal);

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
        setShowMoveTaskModal(false);
      }
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  // Delete Task
  const handleDeleteTask = async () => {
    try {
      const response = await api.delete(`/tasks/${task.id}`);

      if (response.status === 200) {
        removeTask(list.id, task.id);
        setShowTaskItemModal(false);
        toast(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
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
            <span className="list-name">{list.name}</span>
            <Priority task={task} />
          </div>

          <div className="button-group">
            <button
              className="btn-icon close-btn"
              onClick={toggleTaskItemModal}
            >
              <IoMdClose size={20} />
            </button>

            <button className="btn-icon move-btn" onClick={toggleMoveTaskModal}>
              <TbArrowsExchange size={20} />
            </button>

            <button className="btn-icon delete-btn" onClick={handleDeleteTask}>
              <IoMdTrash size={20} />
            </button>
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

      <Modal
        show={showMoveTaskModal}
        onHide={toggleMoveTaskModal}
        dialogClassName="move-task-modal"
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
          <button className="btn-cancel" onClick={toggleMoveTaskModal}>
            Cancel
          </button>
          <button className="btn-text" onClick={handleMoveTask}>
            Move Task
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskItem;
