import { createContext } from 'react';
import { User } from '../models/User';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;