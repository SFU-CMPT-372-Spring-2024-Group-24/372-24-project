// Icons
import { IoMdAdd } from "react-icons/io";
// Libraries
import { useEffect, useState } from "react";
// Styles
import "./TaskList.scss";
// Components
import TaskItem from "../TaskItem/TaskItem";
// Models
import { Task } from "../../../models/Task";

interface Props {
  projectId: number;
  listName: string;
}

const TaskList = ({ projectId, listName }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(
        `/api/tasks?projectId=${projectId}&listName=${listName}`
      );
      const tasksData = await response.json();

      if (tasksData) {
        setTasks(tasksData);
      }
    };

    fetchTasks();
  }, [projectId, listName]);

  return (
    <div className="taskList">
      <div className="list-header">
        <h2>{listName}</h2>

        <button className="add-task">
          <IoMdAdd size={20} />
          Add Task
        </button>
      </div>

      <div className="task-count">{tasks.length} tasks</div>

      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            projectId={projectId}
            listName={listName}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
