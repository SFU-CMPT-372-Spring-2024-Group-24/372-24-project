import { User } from "./User";
import { Project } from "./Project";
export interface Chat {
  id: number;
  name: string;
  createdAt: Date;
  Users: User[];
  Projects: Project[];
  lastMessage: Message;
}

export interface Message {
  id: number;
  message: string;
  chatId: number;
  createdAt: Date;
  User: { id: number; name: string; username: string; profilePicture: string };
  // User: User;
}
