import { User } from './User';

export type PriorityTypes = "unset" | "planning" | "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: PriorityTypes;
  dueDate: Date;
  assignees: User[];
}