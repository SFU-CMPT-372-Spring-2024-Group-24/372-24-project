// Models
import { Chat, Message } from "../../../models/Chat";
// Hooks
import { useUser } from "../../../hooks/UserContext";
import { useEffect, useRef, useState } from "react";
import { useApiErrorHandler } from "../../../hooks/useApiErrorHandler";
import { useChats } from "../../../hooks/ChatContext";
// API
import { api, AxiosError } from "../../../api";
// Icons, files
import { IoSend } from "react-icons/io5";
import defaultProfilePicture from "../../../assets/default-profile-picture.png";
// Libraries
import { Tooltip } from "react-tooltip";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

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
          username: user.username,
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
    };

    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, [socket, chats, setChats]);

  // Group messages by date
  function groupByDate(messages: Message[]) {
    return messages.reduce((groups: { [key: string]: Message[] }, message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  }

  const messagesByDate = groupByDate(messages);

  return (
    <section className="chat-view">
      <div className="chat-body">
        <div className="message-container">
          {Object.entries(messagesByDate).map(([date, messages], index) => (
            <div key={index}>
              <div className="date">{date}</div>

              {messages.map((message, index) => (
                <div
                  className="message"
                  id={user.id === message.User.id ? "you" : "other"}
                  key={index}
                >
                  <div className="message-meta">
                    {user.id !== message.User.id && (
                      <>
                        <Tooltip
                          id="tooltip"
                          content={`${message.User.name}`}
                        ></Tooltip>
                        <img
                          src={`${
                            message.User.profilePicture || defaultProfilePicture
                          }`}
                          alt="User Avatar"
                          data-tooltip-id="tooltip"
                        />
                      </>
                    )}
                  </div>
                  <div className="message-content">{message.message}</div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-footer">
        <input
          type="text"
          value={newMessage}
          placeholder="Aa"
          onChange={(event) => {
            setNewMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && handleAddMessage();
          }}
          autoFocus
        />
        <button onClick={handleAddMessage}>
          <IoSend size={20} />
        </button>
      </div>
    </section>
  );
};

export default ChatView;
