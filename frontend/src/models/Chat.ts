import { User } from './User';

export interface Chat {
  id: number;
  name: string;
  Users: User[];
}

export interface Message {
  id: number;
  message: string;
  chatId: number;
  createdAt: Date;
  User: { id: number; name: string; username: string };
}
