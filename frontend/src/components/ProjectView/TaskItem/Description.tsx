// Libraries
import { useEffect, useRef, useState } from "react";
// Models
import { Task } from "../../../models/Task";
// API
import { api } from "../../../api";

interface Props {
  task: Task;
  setTask: (updatedTask: Task) => void;
}

const Description = ({ task, setTask }: Props) => {
  const [showTextArea, setShowTextArea] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(task.description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

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
      });

      setTask({ ...task, description: response.data.description });
      setErrorMsg("");
      setShowTextArea(false);
    } catch (error) {
      console.error("Error updating description:", error);
      setErrorMsg("An error occurred while updating the description.");
    }
  };

  const handleCancel = () => {
    setDescription(task.description);
    setShowTextArea(false);
  };

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
              <button
                type="submit"
                className="btn-text"
              >
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
          <p onClick={() => setShowTextArea(true)}>{task.description || "None"}</p>
        )}
      </div>
    </div>
  );
};

export default Description;
