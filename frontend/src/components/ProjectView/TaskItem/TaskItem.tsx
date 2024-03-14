import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

import "./TaskItem.scss";
import { IoMdClose, IoMdTrash } from "react-icons/io";
import {
  FaFile,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa6";
import { FaFileArchive } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { TbArrowsExchange } from "react-icons/tb";

interface Props {
  modalIsOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
}

const TaskItem = ({ modalIsOpen, setModalIsOpen }: Props) => {
  const closeModal = () => setModalIsOpen(false);

  const getFileIcon = (fileExtension: string) => {
    switch (fileExtension) {
      case "pdf":
        return <FaFilePdf size={20} color="F40F02" />;
      case "doc":
      case "docx":
        return <FaFileWord size={20} color="2b579a" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel size={20} color="217346" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint size={20} color="d24726" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage size={20} color="48c96f" />;
      case "zip":
      case "rar":
        return <FaFileArchive size={20} color="4D4A4F" />;
      default:
        return <FaFile size={20} />;
    }
  };

  return (
    <Modal show={modalIsOpen} onHide={closeModal} dialogClassName="task-item">
      <Modal.Header className="header">
        <div className="task-title">
          <h3>Sample Task View</h3>

          <span className="list-name">To do</span>
        </div>

        <span className="priority urgent">Urgent</span>

        <button className="move-btn">
          <TbArrowsExchange size={20} />
        </button>

        <button className="delete-btn">
          <IoMdTrash size={20} />
        </button>

        <button className="close-btn" onClick={closeModal}>
          <IoMdClose size={20} />
        </button>
      </Modal.Header>

      <Modal.Body className="body">
        <div className="description">
          <h4>Description</h4>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, nemo!
        </div>

        <div className="due-date">
          <h4>Due date</h4>

          <div className="check-due-date">
            <input type="checkbox" name="dueDate" id="dueDate" />
            <label htmlFor="dueDate">Tomorrow at 1:30 PM</label>
          </div>
        </div>

        <div className="members">
          <h4>Members</h4>
          <div className="member">
            <img
              src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User Avatar"
            />
            <p>John Doe</p>
          </div>
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
  );
};

export default TaskItem;
