// Icons
import { IoMdAdd } from "react-icons/io";
// Libraries
import { useState } from "react";
import { toast } from "react-toastify";
// Styles
import "./TaskList.scss";
// Components
import TaskItem from "../TaskItem/TaskItem";
// API
import { api, AxiosError } from "../../../api";
import { Droppable } from "@hello-pangea/dnd";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";

interface Props {
  listId: number;
}

const TaskList = ({ listId }: Props) => {
  const { project, lists, addTask, userCanPerform } = useTasks();
  const list = lists.find((list) => list.id === listId);
  const tasks = list?.tasks || [];
  const [showTaskInput, setShowTaskInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");
  const handleApiError = useApiErrorHandler();

  // Toggle visibility of add task input field
  const handleToggleTaskInputField = () => {
    setShowTaskInput(!showTaskInput);
    setTaskName("");
  };

  // Send a POST request to server to add a new task
  const handleAddTask = async () => {
    if (taskName.trim() === "") return;

    try {
      const response = await api.post(`/tasks`, {
        name: taskName,
        listId,
        projectId: project.id,
      });

      addTask(listId, response.data);
      setTaskName("");
      toast.success("New task added");
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  return (
    <>
      {list && (
        <div className="taskList">
          <div className="list-header">
            <h2>{list.name}</h2>

            {/* Show add task button if user has 'create' permission */}
            {userCanPerform("manageTasks") && (
              <button
                type="button"
                className="btn-iconTxt add-task"
                onClick={handleToggleTaskInputField}
              >
                <IoMdAdd size={16} />
                Add Task
              </button>
            )}
          </div>

          <div className="list-main">
            {/* Show task input field if user clicks on 'Add Task' button */}
            <div className="task-input-field">
              {showTaskInput && (
                <>
                  <input
                    type="text"
                    id="taskName"
                    name="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTask();
                    }}
                  />

                  <div className="button-group">
                    <button
                      className="btn-cancel"
                      onClick={handleToggleTaskInputField}
                    >
                      Cancel
                    </button>

                    <button className="btn-text" onClick={handleAddTask}>
                      Save task
                    </button>
                  </div>
                </>
              )}
            </div>

            {tasks.length > 0 && (
              <div className="task-count">
                {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              </div>
            )}

            <Droppable droppableId={list.id.toString()}>
              {(provided) => (
                <ul
                  className="task-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasks.length === 0 ? (
                    <li>No tasks yet</li>
                  ) : (
                    tasks.map((task, index) => (
                      <TaskItem
                        key={task.id}
                        list={list}
                        task={task}
                        index={index}
                      />
                    ))
                  )}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskList;
