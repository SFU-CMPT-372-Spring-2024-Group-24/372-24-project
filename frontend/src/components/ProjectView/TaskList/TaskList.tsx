// Icons
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
// Libraries
import { useEffect, useState } from "react";
// Styles
import "./TaskList.scss";
// Components
import TaskItem from "../TaskItem/TaskItem";
// Models
import { Task } from "../../../models/Task";
// API
import { api } from "../../../api";

interface Props {
  listId: number;
  listName: string;
}

const TaskList = ({ listId, listName }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskInput, setShowTaskInput] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>("");

  // Fetch tasks by listId from server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/tasks/${listId}`);
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks: ", error);
      }
    };

    fetchTasks();
  }, [listId]);

  // Toggle visibility of add task input field
  const handleToggleTaskInputField = () => {
    setShowTaskInput(!showTaskInput);
    setTaskName("");
  };

  // Send a POST request to server to add a new task
  const handleAddTask = async () => {
    if (taskName.trim() === "") return;

    try {
      const response = await api.post("/tasks", { name: taskName, listId });
      const newTask = response.data;

      setTasks([...tasks, newTask]);
      setTaskName("");
    } catch (error) {
      console.error("Failed to add task: ", error);
    }
  };

  // Update task in state
  const setTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="taskList">
      <div className="list-header">
        <h2>{listName}</h2>

        <button
          type="button"
          className="btn-iconTxt"
          onClick={handleToggleTaskInputField}
        >
          <IoMdAdd size={16} />
          Add Task
        </button>
      </div>

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

      <div className="task-count">{tasks.length} tasks</div>

      <ul>
        {tasks.length === 0 ? (
          <li>No tasks yet</li>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              setTask={setTask}
              listId={listId}
              listName={listName}
              deleteTask={deleteTask}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;
