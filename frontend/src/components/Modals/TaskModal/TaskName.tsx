// Models
import { Task } from "../../../models/Task";
// Libraries
import { useState } from "react";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
// Icons
import { FiEdit2 } from "react-icons/fi";
// API
import { api, AxiosError } from "../../../api";

interface Props {
  task: Task;
}

const TaskName = ({ task }: Props) => {
  const { project, setTask, userCanPerform } = useTasks();
  const [taskName, setTaskName] = useState<string>(task.name);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { handleApiError } = useApiErrorHandler();

  const handleTaskNameChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (taskName.trim() === task.name) {
      setTaskName(task.name);
      setIsEditing(false);
      return;
    }

    try {
      const response = await api.put(`/tasks/${task.id}`, {
        name: taskName.trim(),
        projectId: project.id,
      });

      // ???
      task.name = response.data.name;

      setTask({ ...task, name: response.data.name });
      setIsEditing(false);
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  return (
    <div className="task-name">
      {isEditing ? (
        <form onSubmit={handleTaskNameChange}>
          <input
            className="btn-text"
            id="task-name"
            name="task-name"
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            autoFocus
          />

          <div className="btn-group">
            <button type="submit" className="btn-text">Save</button>

            <button
              className="btn-cancel"
              type="button"
              onClick={() => {
                setTaskName(task.name);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <h3>
            {task.name}
            
          {userCanPerform("manageTasks") && (
            <button className="btn-icon" onClick={() => setIsEditing(true)}>
              <FiEdit2 size={14} />
            </button>
          )}
        </h3>
      )}
    </div>
  );
};

export default TaskName;
