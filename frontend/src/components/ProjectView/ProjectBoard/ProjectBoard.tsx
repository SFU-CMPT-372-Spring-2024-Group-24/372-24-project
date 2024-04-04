// Hooks
import { useState } from "react";
import { useTasks } from "../../../hooks/TaskContext";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
// Components
import TaskList from "../TaskList/TaskList";
// Libraries
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
// API
import { api, AxiosError } from "../../../api";
// Styles
import "./ProjectBoard.scss";

interface Props {}

const ProjectBoard = ({}: Props) => {
  const { project, setProject, lists, moveTask, userCanPerform } = useTasks();
  const [editingName, setEditingName] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(project.name);
  const handleApiError = useApiErrorHandler();

  // Edit project name
  const handleEditProjectName = async () => {
    const trimmedName = newName.trim();

    if (!trimmedName || trimmedName === project.name) {
      setNewName(project.name);
      setEditingName(false);
      return;
    }

    try {
      const response = await api.put(`/projects/${project.id}`, {
        name: trimmedName,
      });

      setProject(response.data);
      setEditingName(false);
      toast.success("Project name updated successfully");
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    moveTask(
      parseInt(source.droppableId),
      parseInt(destination.droppableId),
      source.index,
      destination.index
    );
  };

  return (
    <section className="project-board">
      {/* Project name */}
      <div
        className={`
          project-title 
          ${editingName ? "editing" : ""}
          ${userCanPerform("manageProject") ? "editable" : ""}
        `}
        onClick={() => {
          if (userCanPerform("manageProject")) setEditingName(true);
        }}
      >
        {editingName ? (
          <input
            id="project-name"
            name="project-name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleEditProjectName}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditProjectName();
            }}
            autoFocus
          />
        ) : (
          <h1 className="gradient-text">{project.name}</h1>
        )}
      </div>

      {/* Project lists */}
      <div className="project-lists">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {lists.map((list) => (
            <TaskList key={list.id} listId={list.id} />
          ))}
        </DragDropContext>
      </div>
    </section>
  );
};

export default ProjectBoard;
