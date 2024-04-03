// a lot of code taken from: https://www.youtube.com/watch?v=NU-HfZY3ATQ&t=610s
import ScrollToBottom from "react-scroll-to-bottom";
import { useEffect, useState } from "react";
import defaultProfilePicture from "../../assets/default-profile-picture.png";
import "./ChatMessages.scss";
import { Socket } from "socket.io-client";
import { useUser } from "../../hooks/UserContext";
import { api } from "../../api";
import { IoSettingsOutline } from "react-icons/io5";
import Modal from "react-bootstrap/Modal";
import { User } from "../../models/User";
import Select, { MultiValue } from "react-select";
import { Option } from "./Chat";

interface Props {
  socket: Socket;
  username: string;
  chatID: string;
  goBack: () => void;
  chatName: string;
  members: User[];
  setMembers: (members: User[]) => void;
  userList: Option[];
}

function ChatMessages({
  socket,
  username,
  chatID,
  goBack,
  chatName,
  members,
  setMembers,
  userList,
}: Props) {
  const { user } = useUser();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<any[]>([]);
  const [showEditChatModal, setShowEditChatModal] = useState<boolean>(false);
  const [addMembersList, setAddMembersList] = useState<Option[]>([]);
  const [currentSelectValue, setCurrentSelectValue] = useState<
    MultiValue<Option>
  >([]);
  //insert message into messages table, need chat_id, and user_id, and message_text
  //pull from the database the past messages

  const openEditChatModal = () => setShowEditChatModal(true);
  const closeEditChatModal = () => {
    setShowEditChatModal(false);
    // setSearchQuery("");
    // setSearchResults([]);
    // setSelectedUsers([]);
  };

  const addNewMessage = async (chatID: String, userID: any, text: String) => {
    //get current time
    var currentDate = new Date();
    try {
      await api.post("/chats/addMessage", {
        chatID: chatID,
        userID: userID,
        text: text,
        date: currentDate,
      });
      //console.log(response.data);
    } catch (error) {
      console.error("Error adding new message", error);
    }
  };

  const getMessagesFromChatID = async () => {
    // try {
    //   const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/chats/getMessagesFromChat/${chatID}`);
    //   const messages = await response.json();
    //   setMessageList(messages);
    //   // console.log("Messages:", messages);
    // } catch (error) {
    //   console.error("Error fetching messages", error);
    // }
    try {
      const response = await api.get(`/chats/getMessagesFromChat/${chatID}`);
      setMessageList(response.data);
      // console.log("Messages:", response.data);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      // const messageData = {
      //   chatID: chatID,
      //   author: username,
      //   message: currentMessage,
      //   timeSent:
      //     new Date(Date.now()).getHours() +
      //     ":" +
      //     new Date(Date.now()).getMinutes(),
      // };
      await addNewMessage(chatID, user?.id, currentMessage);
      socket.emit("send_message", chatID);
      await getMessagesFromChatID();
      // setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const handleRemoveUser = async (user: User) => {
    try {
      const response = await api.delete(
        `/chats/${chatID}/removeUser/${user.id}`
      );
      if (response.status === 200) {
        console.log("Got 200 response!");
        console.log("Members before: ", members);
        setMembers(members.filter((member) => member.id !== user.id));
        console.log("Members after", members);
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
    console.log("userList:", userList);
    makeOptions(userList);
    //make a new object that parses through the values
    // console.log("myUserList:", myUserList);
  }, []);

  useEffect(() => {
    makeOptions(userList);
  }, [members]);

  const makeOptions = (userList: Option[]) => {
    //parse the strings so you can remove unneeded users
    let myUserList = userList.map((option: Option) => {
      return {
        additionalInfo: option.additionalInfo,
        label: option.label,
        value: JSON.parse(option.value),
      };
    });
    console.log("myUserList before:", myUserList);
    //remove the users that are already added to the chat
    console.log("members:", members);
    let results: Option[] = myUserList.filter(
      (option) => !members.some((member) => option.value.id === member.id)
    );
    let results2: Option[] = results.map((option: Option) => {
      return new Option(
        JSON.stringify(option.value),
        option.label,
        option.additionalInfo
      );
    });
    console.log(results2);
    setAddMembersList(results2);
  };

  const updateAddMembersList = (selectedOptions: MultiValue<Option>) => {
    setCurrentSelectValue(selectedOptions);
  };

  const addNewMembers = async (event: any) => {
    event.preventDefault();
    console.log("Adding new Members!");
    console.log(currentSelectValue);
    // console.log(
    //   "mapping:",
    //   currentSelectValue.map((user) => JSON.parse(user.value).id)
    // );
    //console.log(currentSelectValue.map((user) => JSON.parse(user.value).id));
    //call api to add users to the chat
    if (currentSelectValue.length > 0) {
      const response = await api.post(`/chats/addUsers/${chatID}`, {
        userIDs: currentSelectValue.map((user) => JSON.parse(user.value).id),
      });
      //update members to include the values before and also the new users added before the response
      if (response.status === 201) {
        setMembers([
          ...members,
          ...currentSelectValue.map((user) => JSON.parse(user.value)),
        ]);
        setCurrentSelectValue([]);
        socket.emit("chat_added");
      }
    }
  };
  function convertTime(isoString: string) {
    var date = new Date(isoString);
    // console.log(date.getHours());
    return (
      date.getHours() +
      ":" +
      (date.getMinutes() < 10 ? "0" : "") +
      date.getMinutes()
    );
  }
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
            onClick={openEditChatModal}
          >
            <IoSettingsOutline size={20} />
          </button>
          <p> {chatName} </p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageContent, index) => {
              return (
                <div
                  className="message"
                  id={username == messageContent.User.name ? "other" : "you"}
                  key={index}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageContent.message}</p>{" "}
                    </div>
                    <div className="message-meta">
                      <p id="time">{convertTime(messageContent.date)}</p>
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
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
        <Modal
          show={showEditChatModal}
          onHide={closeEditChatModal}
          dialogClassName="add-member-modal"
          backdropClassName="add-member-modal-backdrop"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Manage chat members</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <section>
              <h5>Current members</h5>
              <ul className="members-list">
                {members.map((user) => (
                  <li className="member" key={user.id}>
                    <img
                      src={user.profilePicture || defaultProfilePicture}
                      alt="User Avatar"
                    />

                    <div className="member-info">
                      <p>{user.name}</p>
                      <p>{user.username}</p>
                    </div>

                    <button
                      className="btn-icon btn-remove-user"
                      onClick={() => handleRemoveUser(user)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div>
                <h5>Add members to your chat</h5>
                <form className="search-member" onSubmit={addNewMembers}>
                  <Select
                    isMulti
                    name="selectUsers"
                    value={currentSelectValue}
                    options={addMembersList}
                    onChange={updateAddMembersList}
                    getOptionLabel={(option: Option) =>
                      `${option.label}, ${option.additionalInfo}`
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  <button type="submit" className="btn btn-primary">
                    Add New Members
                  </button>
                </form>
              </div>
            </section>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default ChatMessages;
