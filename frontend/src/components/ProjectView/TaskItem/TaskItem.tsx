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
import { IoSend } from "react-icons/io5";
import { TbArrowsExchange } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa6";
// Utils
import { getFileIcon } from "../../../utils/fileUtils";
// import { priorities } from "../../../utils/priorityColorUtils";
// Models
import { Task } from "../../../models/Task";
import { List } from "../../../models/List";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// Components
import Priority from "./Priority";
import Description from "./Description";
import DueDate from "./DueDate";
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
      const response = await moveTask(list.id, selectedListId, index, selectedPosition);

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
        // deleteTask(task.id);
        removeTask(list.id, task.id);
        setShowTaskItemModal(false);
        toast.success(response.data.message, {
          className: "toast-success",
        });
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
            <h3>
              {task.name}
            </h3>

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
          <div className="task-title">
            <h3>{task.name}</h3>

            <span className="list-name">{list.name}</span>
          </div>

          <Priority task={task} />

          <button className="btn-icon move-btn" onClick={toggleMoveTaskModal}>
            <TbArrowsExchange size={20} />
          </button>

          <button className="btn-icon delete-btn" onClick={handleDeleteTask}>
            <IoMdTrash size={20} />
          </button>

          <button className="close-btn" onClick={toggleTaskItemModal}>
            <IoMdClose size={20} />
          </button>
        </Modal.Header>

        <Modal.Body className="body">
          <Description task={task} />

          <DueDate task={task} />

          <div className="members">
            <h4>Members</h4>

            {task.assignees &&
              task.assignees.map((assignee) => (
                <div className="member" key={assignee.id}>
                  <img
                    src={assignee.profilePicture || defaultProfilePicture}
                    alt="User Avatar"
                  />
                  <p>{assignee.name}</p>
                </div>
              ))}
          </div>

          <div className="attachments">
            <h4>Attachments</h4>

            <div className="file">
              {getFileIcon("doc")}
              <p>example.docx</p>
            </div>
          </div>

          <div className="comments">
            <h4>Comments</h4>

            <p className="view-more">View more comments</p>

            <div className="comment">
              <img
                src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="User Avatar"
              />
              <div className="comment-details">
                <span>John Doe</span>
                <span className="comment-time">1 day ago</span>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Id,
                  nemo!
                </p>
              </div>
            </div>

            <div className="comment">
              <img
                src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="User Avatar"
              />
              <div className="comment-details">
                <span>Mary Ann</span>
                <span className="comment-time">Just now</span>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Id,
                  nemo!
                </p>
              </div>
            </div>

            <div className="add-comment">
              <textarea
                name="comment"
                id="comment"
                placeholder="Write a comment..."
              ></textarea>
              <button>
                <IoSend size={16} />
              </button>
            </div>
          </div>
        </Modal.Body>
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
          <p>Current Position: {index+1}</p>

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
