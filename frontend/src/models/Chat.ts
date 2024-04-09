import { User } from "./User";
import { Project } from "./Project";
export interface Chat {
  id: number;
  name: string;
  Users: User[];
  Projects: Project[];
}

export interface Message {
  id: number;
  message: string;
  chatId: number;
  createdAt: Date;
  User: { id: number; name: string; username: string };
}
