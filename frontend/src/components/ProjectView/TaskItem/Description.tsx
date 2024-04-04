// Libraries
import { useEffect, useRef, useState } from "react";
// Models
import { Task } from "../../../models/Task";
// API
import { api, AxiosError } from "../../../api";
// Custom hooks
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";

interface Props {
  task: Task;
}

const Description = ({ task }: Props) => {
  const [showTextArea, setShowTextArea] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(task.description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { setTask, project, userCanPerform } = useTasks();
  const handleApiError = useApiErrorHandler();

  // Update task description
  const handleDescriptionChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedDescription = description.trim();

    if (trimmedDescription === task.description) {
      setDescription(task.description);
      setShowTextArea(false);
      return;
    }

    try {
      const response = await api.put(`/tasks/${task.id}`, {
        description: trimmedDescription,
        projectId: project.id,
      });

      setTask({ ...task, description: response.data.description });
      setErrorMsg("");
      setShowTextArea(false);
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Cancel editing description
  const handleCancel = () => {
    setDescription(task.description);
    setShowTextArea(false);
  };

  // Focus textarea when editing description
  useEffect(() => {
    if (showTextArea && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, [showTextArea]);

  return (
    <div className="">
      <h4>Description</h4>

      <div className="description">
        {showTextArea ? (
          <form onSubmit={handleDescriptionChange}>
            {errorMsg && <div className="error-msg">{errorMsg}</div>}

            <textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
            />

            <div className="button-group">
              <button type="submit" className="btn-text">
                Save
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <p
            onClick={() => {
              if (userCanPerform("manageTasks")) {
                setShowTextArea(true);
              }
            }}
            className={userCanPerform("manageTasks") ? "editable" : ""}
          >
            {task.description || "None"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Description;
