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
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/tasks/${listId}`);
      const tasksData = await response.json();

      if (tasksData) {
        setTasks(tasksData);
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

    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: taskName, listId }),
    });

    const newTask = await response.json();

    setTasks([...tasks, newTask]);
    setTaskName("");
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
          className="show-add-task"
          onClick={handleToggleTaskInputField}
        >
          <IoMdAdd size={20} />
          Add Task
        </button>
      </div>

      <div className="task-input-field">
        {showTaskInput && (
          <>
            <input
              type="text"
              id = "taskName"
              name = "taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
              }}
            />

            <div className="button-group">
              <button className="add-task" onClick={handleAddTask}>Add</button>

              <button className="close-btn" onClick={handleToggleTaskInputField}>
                <IoClose size={22}/>
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
