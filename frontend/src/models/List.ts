import { Task } from './Task';

export interface List {
  id: number;
  name: string;
  projectId: number;
  tasks: Task[];
}