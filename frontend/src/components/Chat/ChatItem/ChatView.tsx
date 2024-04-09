// Models
import { Chat, Message } from "../../../models/Chat";
// Libraries
import ScrollToBottom, { useAnimating } from "react-scroll-to-bottom";
import { Socket } from "socket.io-client";
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

  const { socket } = useChats();
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
        User: { id: user.id, name: user.name, username: user.username },
      };

      // Emit message to socket server
      socket.emit("send_message", data);

      // Update message list
      setMessages([...messages, data]);

      // Clear message input
      setNewMessage("");
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  // Listen for new messages
  useEffect(() => {
    socket.on("receive_message", (newMessage: Message) => {
      setMessages((list) => [...list, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  return (
    <>
      <div className="chat-body">
        {/* Chat View */}
        <ScrollToBottom className="message-container">
          {messages.map((messageContent, index) => {
            return (
              <div
                className="message"
                id={
                  user.username === messageContent.User.username
                    ? "you"
                    : "other"
                }
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
