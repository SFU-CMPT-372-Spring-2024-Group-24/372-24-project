// Libraries
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
// Custom Hooks
import { useTasks } from "../../../hooks/TaskContext";
// Components
import TaskList from "../TaskList/TaskList";

const TaskLists = () => {
  const { lists, moveTask } = useTasks();

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
    <>
      <div className="project-lists">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          {lists.map((list) => (
            <TaskList key={list.id} listId={list.id} />
          ))}
        </DragDropContext>
      </div>
    </>
  );
};

export default TaskLists;
