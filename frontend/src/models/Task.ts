import { User } from './User';

export type PriorityTypes = "unset" | "planning" | "low" | "medium" | "high" | "urgent";

export interface Task {
  id: number;
  name: string;
  description: string;
  priority: PriorityTypes;
  dueDate: Date;
  assignees: User[];
  isDone: boolean;
}