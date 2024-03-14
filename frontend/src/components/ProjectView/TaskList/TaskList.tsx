import { FaRegClock } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";

import "./TaskList.scss";
import { useState } from "react";
import TaskItem from "../TaskItem/TaskItem";

interface Props {
  listName: string;
}

const TaskList = ({ listName }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const handleShowTask = () => setModalIsOpen(true);

  return (
    <div className="taskList">
      <div className="list-header">
        <h2>{listName}</h2>

        <button className="add-task">
          <IoMdAdd size={20} />
          Add Task
        </button>
      </div>

      <div className="task-count">3 tasks</div>

      <ul className="list">
        <li className="item" onClick={handleShowTask}>
          <h3>Sample Task View</h3>

          <div className="info">
            <div className="due-date">
              <FaRegClock size={18} /> 5 days
            </div>

            <img
              src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User Avatar"
              className="assignee"
            />
          </div>
        </li>

        <TaskItem modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} />

        <li className="item">
          <h3>Task 2</h3>

          <div className="info">
            <div className="due-date">
              <FaRegClock size={18} /> Mar 20
            </div>

            <img
              src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User Avatar"
              className="assignee"
            />
          </div>
        </li>

        <li className="item">
          <h3>Task 3</h3>

          <div className="info">
            <div className="due-date">
              <FaRegClock size={18} /> 5 days
            </div>

            <img
              src="https://images.unsplash.com/photo-1707343844152-6d33a0bb32c3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="User Avatar"
              className="assignee"
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TaskList;
