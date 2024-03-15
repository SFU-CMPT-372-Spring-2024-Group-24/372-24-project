import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../models/User";

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

interface Props {
  children: ReactNode;
}
export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const user = await response.json();
          setUser(user);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch user", errorData);
          setUser(null);
        }
      } catch (error) {
        console.error("An error occurred while fetching user", error);
      } finally {
        setLoading(false);
      }
    };

    if (window.location.pathname !== "/login") {
      fetchUser();
    } else {
      setLoading(false);
    }
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
