// Hooks
import { useEffect, useState } from "react";
import { useUser } from "../../hooks/UserContext";
import { useApiErrorHandler } from "../../hooks/useApiErrorHandler";
// Files
import defaultProfilePicture from "../../assets/default-profile-picture.png";
// API
import { api, AxiosError } from "../../api";
// Icons and styles
import { IoSettingsOutline } from "react-icons/io5";
import "./ChatMessages.scss";
// Libraries
import Modal from "react-bootstrap/Modal";
import { Socket } from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
// Models
import { User } from "../../models/User";
import { Chat, ChatMessage } from "../../models/Chat";

interface Props {
  socket: Socket;
  goBack: () => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat) => void;
}

function ChatMessages({
  socket,
  goBack,
  selectedChat,
  setSelectedChat,
}: Props) {
  const { user } = useUser();
  const { handleApiError } = useApiErrorHandler();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);

  if (!selectedChat || !user) {
    return null;
  }

  // Use socket to update the message list in real-time
  useEffect(() => {
    
    socket.on("receive_message", (newMessage: ChatMessage) => {
      console.log("I received message:", newMessage)
      setMessageList((list) => [...list, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const handleAddMessage = async () => {
    try {
      const response = await api.post("/chats/messages", {
        chatId: selectedChat.id,
        message: currentMessage,
      });

      const newMessage: ChatMessage = {
        id: response.data.id,
        message: response.data.message,
        chatId: response.data.chatId,
        createdAt: response.data.createdAt,
        User: { id: user.id, name: user.name, username: user.username },
      };

      // Emit message to socket server
      socket.emit("send_message", newMessage);

      // Update message list
      setMessageList([...messageList, newMessage]);
      
      // Clear message input
      setCurrentMessage("");
    } catch (error) {
      handleApiError(error as AxiosError);
    }
  };

  const getMessagesFromChatID = async () => {
    try {
      const response = await api.get(`/chats/messages/${selectedChat.id}`);
      setMessageList(response.data);
    } catch (error) {
      console.log("Failed to get messages from chat ID: ", error);
      
      handleApiError(error as AxiosError);
    }
  };

  const handleRemoveUser = async (user: User) => {
    try {
      const response = await api.delete(
        `/chats/${selectedChat.id}/removeUser/${user.id}`
      );
      if (response.status === 200) {
        setSelectedChat({
          ...selectedChat,
          Users: selectedChat.Users.filter((u) => u.id !== user.id),
        });
        socket.emit("chat_added");
      }
    } catch (error) {
      console.error("Failed to remove member: ", error);
    }
  };

  //when change in socket server
  useEffect(() => {
    socket.off("receive_message").on("receive_message", async () => {
      // setMessageList((list) => [...list, data]);
      //get the message list from the correct id
      await getMessagesFromChatID();
    });
  }, [socket]);

  useEffect(() => {
    getMessagesFromChatID();
    //make a new object that parses through the values
    // console.log("myUserList:", myUserList);
  }, []);

  // useEffect(() => {
  //   makeOptions(userList);
  // }, [members]);

  // const makeOptions = (userList: Option[]) => {
  //   //parse the strings so you can remove unneeded users
  //   let myUserList = userList.map((option: Option) => {
  //     return {
  //       additionalInfo: option.additionalInfo,
  //       label: option.label,
  //       value: JSON.parse(option.value),
  //     };
  //   });
  //   console.log("myUserList before:", myUserList);
  //   //remove the users that are already added to the chat
  //   console.log("members:", members);
  //   let results: Option[] = myUserList.filter(
  //     (option) => !members.some((member) => option.value.id === member.id)
  //   );
  //   let results2: Option[] = results.map((option: Option) => {
  //     return new Option(
  //       JSON.stringify(option.value),
  //       option.label,
  //       option.additionalInfo
  //     );
  //   });
  //   console.log(results2);
  //   setAddMembersList(results2);
  // };

  // const addNewMembers = async (event: any) => {
  //   event.preventDefault();
  //   console.log("Adding new Members!");
  //   console.log(currentSelectValue);
  //   // console.log(
  //   //   "mapping:",
  //   //   currentSelectValue.map((user) => JSON.parse(user.value).id)
  //   // );
  //   //console.log(currentSelectValue.map((user) => JSON.parse(user.value).id));
  //   //call api to add users to the chat
  //   if (currentSelectValue.length > 0) {
  //     const response = await api.post(`/chats/addUsers/${chatID}`, {
  //       userIDs: currentSelectValue.map((user) => JSON.parse(user.value).id),
  //     });
  //     //update members to include the values before and also the new users added before the response
  //     if (response.status === 201) {
  //       setMembers([
  //         ...members,
  //         ...currentSelectValue.map((user) => JSON.parse(user.value)),
  //       ]);
  //       setCurrentSelectValue([]);
  //       socket.emit("chat_added");
  //     }
  //   }
  // };
  // function convertTime(isoString: string) {
  //   var date = new Date(isoString);
  //   // console.log(date.getHours());
  //   return (
  //     date.getHours() +
  //     ":" +
  //     (date.getMinutes() < 10 ? "0" : "") +
  //     date.getMinutes()
  //   );
  // }
  return (
    <div>
      <div className="chat-window">
        <div className="chat-header">
          <button id="backButton" className="btn btn-primary" onClick={goBack}>
            GO BACK
          </button>
          <button
            type="button"
            className="chat-edit-button"
            // onClick={openEditChatModal}
          >
            <IoSettingsOutline size={20} />
          </button>
          <p> {selectedChat.name} </p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent, index) => {
              return (
                <div
                  className="message"
                  id={user.username === messageContent.User.username ? "you" : "other"}
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
            value={currentMessage}
            placeholder="Insert Chat here..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyDown={(event) => {
              event.key === "Enter" && handleAddMessage();
            }}
          />
          <button onClick={handleAddMessage}>&#9658;</button>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
