// Libraries
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
// Styles
import "./TaskItem.scss";
// Icons
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { TbArrowsExchange } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa6";
// Utils
import { getFileIcon } from "../../../utils/fileUtils";
import { priorities } from "../../../utils/priorityColorUtils";
// Models
import { Task } from "../../../models/Task";
// Files
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// Components
import Priority from "./Priority";
import Description from "./Description";
import DueDate from "./DueDate";
// API
import { api } from "../../../api";

interface Props {
  listId: number;
  listName: string;
  task: Task;
  setTask: (updatedTask: Task) => void;
  deleteTask: (taskId: number) => void;
}

const TaskItem = ({ listName, task, setTask, deleteTask }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const priorityColor = priorities.find(
    (p) => p.value === task.priority
  )?.color;

  // Toggle Task Item details visibility
  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  // Delete Task
  const handleDeleteTask = async () => {
    try {
      const response = await api.delete(`/tasks/${task.id}`);

      if (response.status === 200) {
        deleteTask(task.id);
        setModalIsOpen(false);
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
      <li
        className="task-item"
        onClick={toggleModal}
        style={{ borderColor: priorityColor }}
      >
        <h3>{task.name}</h3>

        {task.dueDate && (
          <div className="info">
            <div className="due-date">
              <FaRegClock size={12} />
              {moment(task.dueDate).format("MMM D hh:mma")}
            </div>

            {/* Todo: Add assignee
          <img
            src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User Avatar"
            className="assignee"
          /> */}
          </div>
        )}
      </li>

      <Modal
        show={modalIsOpen}
        onHide={toggleModal}
        dialogClassName="task-item-modal"
      >
        <Modal.Header className="header">
          <div className="task-title">
            <h3>{task.name}</h3>

            <span className="list-name">{listName}</span>
          </div>

          <Priority task={task} setTask={setTask} />

          <button className="btn-icon move-btn">
            <TbArrowsExchange size={20} />
          </button>

          <button className="btn-icon delete-btn" onClick={handleDeleteTask}>
            <IoMdTrash size={20} />
          </button>

          <button className="close-btn" onClick={toggleModal}>
            <IoMdClose size={20} />
          </button>
        </Modal.Header>

        <Modal.Body className="body">
          <Description task={task} setTask={setTask} />

          <DueDate task={task} setTask={setTask} />

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
    </>
  );
};

export default TaskItem;
