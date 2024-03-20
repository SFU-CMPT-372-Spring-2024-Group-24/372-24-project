// Models
import { useEffect, useRef, useState } from "react";
import { Task } from "../../../models/Task";

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
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: trimmedDescription }),
      });

      if (response.ok) {
        setTask({ ...task, description: trimmedDescription });
        setErrorMsg("");
        setShowTextArea(false);
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.message);
      }
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
                className="btn-save"
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
