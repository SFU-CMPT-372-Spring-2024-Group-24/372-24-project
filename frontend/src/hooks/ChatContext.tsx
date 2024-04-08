// Libraries
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
// Models
import { Chat } from "../models/Chat";
// API
import { api, AxiosError } from "../api";
// Libraries
import io from "socket.io-client";
import { Socket } from "socket.io-client";
// Hooks
import { useUser } from "./UserContext";
import { useApiErrorHandler } from "./useApiErrorHandler";

// Socket
export const socket = io("http://localhost:8080", {
  transports: ["websocket"],
});

// Chat context
interface ChatContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  socket: Socket;
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChats = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChats must be used within a ChatProvider");
  }
  return context;
};

// Chat provider
interface Props {
  children: ReactNode;
  // socket: Socket;
}
export const ChatProvider = ({ children }: Props) => {
  const { user } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const { handleApiError } = useApiErrorHandler();

  useEffect(() => {
    const getRecentChats = async () => {
      if (!user) return;

      try {
        const response = await api.get(`/chats/${user?.id}`);
        setChats(response.data);
      } catch (error) {
        handleApiError(error as AxiosError);
      }
    };
    getRecentChats();

    socket.on("refresh_user_list", getRecentChats);
    return () => {
      socket.off("refresh_user_list");
    };
  }, [user]);

  return (
    <ChatContext.Provider
      value={{ chats, setChats, socket }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
