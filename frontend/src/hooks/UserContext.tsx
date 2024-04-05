// Libraries
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
// Models
import { User } from "../models/User";
// API
import { api } from "../api";

// User context
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// User provider
interface Props {
  children: ReactNode;
}
export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user on mount
  useEffect(() => {
    api.get("/users/me").then((res) => {
      if (res.data.valid) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
