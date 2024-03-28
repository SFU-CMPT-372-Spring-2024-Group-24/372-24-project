import { User } from './User';
export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  // Users: User[];
}