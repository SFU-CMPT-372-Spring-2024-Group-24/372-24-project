// Libraries
import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
// Models
import { Task } from "../models/Task";
import { List } from "../models/List";
import { User } from "../models/User";
// API
import { api } from "../api";

interface TaskContextProps {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  setTask: (updatedTask: Task) => void;
  addTask: (listId: number, newTask: Task) => void;
  removeTask: (listId: number, taskId: number) => void;
  moveTask: (
    sourceListId: number,
    destinationListId: number,
    oldIndex: number,
    newIndex: number
  ) => Promise<boolean>;
  projectMembers: User[];
}
export const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const useTasks = (): TaskContextProps => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }

  return context;
};

interface TaskProviderProps {
  children: React.ReactNode;
  projectMembers: User[];
  projectId: number;
}
export const TaskProvider = ({ children, projectMembers, projectId }: TaskProviderProps) => {
  const [lists, setLists] = useState<List[]>([]);

  // Fetch lists and tasks for the project
  useEffect(() => {
    const fetchListsAndTasks = async () => {
      try {
        // Fetch lists for the project
        const response = await api.get(`/lists/${projectId}`);
        const lists = response.data;

        // Fetch tasks for each list
        const tasksPromises = lists.map((list: List) =>
          api.get(`/tasks/${list.id}`)
        );
        const tasksResponses = await Promise.all(tasksPromises);

        lists.forEach((list: List, index: number) => {
          list.tasks = tasksResponses[index].data;
        });

        setLists(lists);
      } catch (error) {
        console.error("Error fetching lists and tasks:", error);
      }
    }

    fetchListsAndTasks();
  }, [projectId]);

  // Update a task in the state
  const setTask = (updatedTask: Task) => {
    const updatedLists = lists.map((list) => ({
      ...list,
      tasks: list.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));

    setLists(updatedLists);
  };

  // Add a new task to the list
  const addTask = (listId: number, newTask: Task) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return { ...list, tasks: [newTask, ...list.tasks] };
      }
      return list;
    });

    setLists(updatedLists);
  };

  // Remove a task from the list
  const removeTask = (listId: number, taskId: number) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: list.tasks.filter((task) => task.id !== taskId),
        };
      }
      return list;
    });

    setLists(updatedLists);
  };

  // Move a task to a different list or reorder within the same list
  // and update the order index in the database
  const moveTask = async (
    sourceListId: number,
    destinationListId: number,
    oldIndex: number,
    newIndex: number
  ) => {
    const sourceList = lists.find((list) => list.id === sourceListId);
    const destinationList = lists.find((list) => list.id === destinationListId);

    if (!sourceList || !destinationList) return false;

    const sourceTasks = Array.from(sourceList.tasks);
    const destinationTasks = Array.from(destinationList.tasks);
    // Remove the task from the source list
    const [movedTask] = sourceTasks.splice(oldIndex, 1);

    if (sourceListId === destinationListId) {
      // Reordering within the same list
      sourceTasks.splice(newIndex, 0, movedTask);

      // Update the order index of each task in the source list
      sourceTasks.forEach((task, index) => {
        task.orderIndex = index;
      });

      sourceList.tasks = sourceTasks;
    } else {
      // Moving to a different list
      destinationTasks.splice(newIndex, 0, movedTask);

      // Update the order index of each task in the source list
      sourceTasks.forEach((task, index) => {
        task.orderIndex = index;
      });

      // Update the order index of each task in the destination list
      destinationTasks.forEach((task, index) => {
        task.orderIndex = index;
      });

      sourceList.tasks = sourceTasks;
      destinationList.tasks = destinationTasks;
    }

    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id === sourceListId) {
          return sourceList;
        } else if (list.id === destinationListId) {
          return destinationList;
        } else {
          return list;
        }
      })
    );

    try {
      // Update database with the new order index
      const response = await Promise.all([
        ...sourceTasks.map((task) =>
          api.put(`/tasks/${task.id}/order`, {
            orderIndex: task.orderIndex,
            listId: sourceListId,
          })
        ),
        ...destinationTasks.map((task) =>
          api.put(`/tasks/${task.id}/order`, {
            orderIndex: task.orderIndex,
            listId: destinationListId,
          })
        ),
      ]);

      // Update the lists in the state
      if (response.every((res) => res.status === 200)) {
        toast.success("Task moved successfully", {
          className: "toast-success",
        });
        return true;
      }
    } catch (error) {
      throw new Error("Failed to move task: " + error);
    }

    return false;
  };

  return (
    <TaskContext.Provider
      value={{ lists, setLists, setTask, addTask, removeTask, moveTask, projectMembers }}
    >
      {children}
    </TaskContext.Provider>
  );
};
