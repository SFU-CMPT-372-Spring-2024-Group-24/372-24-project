import { User } from './User';

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: "planning" | "low" | "medium" | "high" | "urgent";
  dueDate: Date;
  assignees: User[];
}