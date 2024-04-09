// Hooks
// import { useState } from "react";
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
// Components
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import TaskName from "./TaskName";
import Priority from "./Priority";
import Description from "./Description";
import DueDate from "./DueDate";
import TaskMembers from "./TaskMembers";
import Attachments from "./Attachments";
import Comments from "./Comments";
// Models
import { Task } from "../../../models/Task";
import { List } from "../../../models/List";
// Icons
import { IoMdClose, IoMdTrash } from "react-icons/io";
import { TbArrowsExchange } from "react-icons/tb";
// API
import { api, AxiosError } from "../../../api";

interface Props {
  isShowing: boolean;
  setIsShowing: (show: boolean) => void;
  list: List | undefined;
  task: Task;
}

const TaskModal = ({ isShowing, setIsShowing, list, task }: Props) => {
  const {handleApiError} = useApiErrorHandler();
  const { project, removeTask, userCanPerform } = useTasks();
  // const [isShowingMoveTaskModal, setIsShowingMoveTaskModal] = useState<boolean>(false);

  const handleDeleteTask = async () => {
    try {
      const response = await api.delete(`/tasks/${task.id}`, {
        data: { projectId: project.id },
      });

      if (response.status === 200) {
        if (list?.id) removeTask(list.id, task.id);
        setIsShowing(false);
        toast(response.data.message);
      }
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  return (
    <Modal
      show={isShowing}
      onHide={() => setIsShowing(false)}
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
            {/* TODO: Somehow get list in here */}
            {list?.name}
          </span>
          <Priority task={task} />
        </div>

        <div className="button-group">
          <button
            className="btn-icon close-btn"
            onClick={() => setIsShowing(false)}
          >
            <IoMdClose size={20} />
          </button>
          {userCanPerform("manageTasks") && (
            <>
              <button
                className="btn-icon move-btn"
                // onClick={() => setIsShowingMoveTaskModal(true)}
                onClick={() => {setIsShowing(true)}}
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
  );
};

export default TaskModal;