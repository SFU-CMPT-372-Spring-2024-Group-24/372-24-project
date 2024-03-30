import { User } from './User';

export type PriorityTypes = "unset" | "planning" | "low" | "medium" | "high" | "urgent";

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: PriorityTypes;
  dueDate: Date;
  // members: User[];
  isDone: boolean;
  listId: number;
  orderIndex: number;
}

export interface Comment {
  id: number;
  comment: string;
  createdAt: Date;
  User: User;
  isEdited: boolean;
}