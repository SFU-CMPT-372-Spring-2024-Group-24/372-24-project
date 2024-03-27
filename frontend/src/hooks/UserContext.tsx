import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../models/User";
// API
import { api } from "../api";
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

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
  //       // const response = await fetch(`api/users/me`, {
  //         method: "GET",
  //         credentials: "include",
  //       });
  //       // const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
  //       //   withCredentials: true,
  //       // });
  //       // setUser(response.data);
  //       if (response.ok) {
  //         const userData = await response.json();
  //         setUser(userData);
  //       } else {
  //         setUser(null);
  //       }
  //     } catch (error) {
  //       console.error("An error occurred while fetching user", error);
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // if (window.location.pathname !== "/login") {
  //   //   fetchUser();
  //   // } else {
  //   //   setLoading(false);
  //   // }
  //   fetchUser();
  // }, []);

  useEffect(() => {
    // axios
    //   .get(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
    //     withCredentials: true,
    //   })
    //   .then((res) => {
    //     if (res.data.valid) {
    //       console.log(res.data);
          
    //       setUser(res.data.user);
    //     } else {
    //       setUser(null);
    //     }
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });

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
