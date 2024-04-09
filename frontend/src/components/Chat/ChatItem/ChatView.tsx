// Models
import { Chat, Message } from "../../../models/Chat";
// Libraries
import ScrollToBottom, { useAnimating } from "react-scroll-to-bottom";
// Hooks
import { useUser } from "../../../hooks/UserContext";
import { useEffect, useState } from "react";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
import { useChats } from "../../../hooks/ChatContext";
// API
import { api, AxiosError } from "../../../api";

interface Props {
  chat: Chat;
  // setChat: (chat: Chat) => void;
}

const ChatView = ({ chat }: Props) => {
  const { user } = useUser();
  if (!user) return null;

  const { socket, chats, setChats } = useChats();
  const { handleApiError } = useApiErrorHandler();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch messages for the chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chats/messages/${chat.id}`);
        setMessages(response.data);
      } catch (error) {
        handleApiError(error as AxiosError);
      }
    };

    fetchMessages();
  }, []);

  // Add a new message to the chat
  const handleAddMessage = async () => {
    try {
      const response = await api.post("/chats/messages", {
        chatId: chat.id,
        message: newMessage,
      });

      const data: Message = {
        id: response.data.id,
        message: response.data.message,
        chatId: response.data.chatId,
        createdAt: response.data.createdAt,
        User: {
          id: user.id,
          name: user.name,
          profilePicture: user.profilePicture,
        },
      };

      // Emit message to socket server
      socket.emit("send_message", data);

      // Update message list
      setMessages([...messages, data]);

      // Update last message in chat list
      const updatedChats = chats.map((chatItem) => {
        if (chatItem.id === chat.id) {
          return { ...chatItem, lastMessage: data };
        }
        return chatItem;
      });
      setChats(updatedChats);

      // Clear message input
      setNewMessage("");
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Listen for new messages and update the chat view
  useEffect(() => {
    const receiveMessage = (newMessage: Message) => {
      setMessages((list) => [...list, newMessage]);
    }

    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, [socket, chats, setChats]);

  return (
    <>
      <div className="chat-body">
        {/* Chat View */}
        <ScrollToBottom className="message-container">
          {messages.map((messageContent, index) => {
            return (
              <div
                className="message"
                id={user.id === messageContent.User.id ? "you" : "other"}
                key={index}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>{" "}
                  </div>
                  <div className="message-meta">
                    {/* <p id="time">{convertTime(messageContent.createdAt)}</p> */}
                    <p id="author">{messageContent.User.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={newMessage}
          placeholder="Insert Chat here..."
          onChange={(event) => {
            setNewMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && handleAddMessage();
          }}
        />
        <button onClick={handleAddMessage}>&#9658;</button>
      </div>
    </>
  );
};

export default ChatView;
