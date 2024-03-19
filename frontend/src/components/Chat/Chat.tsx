// import { IoMdChatboxes } from "react-icons/io";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.scss";
import ChatMessages from "./ChatMessages";
import { useUser } from "../../hooks/UserContext";
import { User } from "../../models/User";

const socket = io("http://localhost:8080", { transports: ["websocket"] });

const Chat = () => {
  //   return <IoMdChatboxes size={40} />;
  //somehow get the user_id here
  const { user } = useUser();
  const [userList, setUserList] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  // maybe make this change everytime userList is changed
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to get all users");
        }
        const allUsers = await response.json();
        const filteredAllUsers: User[] = allUsers.filter(
          (myUser: User) => myUser.id != user!.id
        );
        setUserList(filteredAllUsers);
        console.log("User List in try block:", userList);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    getAllUsers();
    setUsername(user!.name);
  }, []);

  const [room, setRoom] = useState("");
  const [chatVisibility, setChatVisibility] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [recentChatters, setRecentChatters] = useState([]);
  const [currentSelectValue, setCurrentSelectValue] = useState("");

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  const goBack = () => {
    setShowChat(false);
  };

  const updateValue = (event: any) => {
    console.log(event.target.value);
    setCurrentSelectValue(event.target.value);
  };
  const addChatter = (event: any) => {
    //use current select value here
    console.log(currentSelectValue);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        id="chatButton"
        onClick={() => setChatVisibility(!chatVisibility)}
      >
        Chat
      </button>
      <div className="chatContainer">
        {chatVisibility && (
          <div className="chatWindow">
            {!showChat ? (
              <>
                <label htmlFor="selectUser">Add a User to chat with:</label>
                <select
                  id="selectUser"
                  value={currentSelectValue}
                  onChange={updateValue}
                >
                  {userList.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={addChatter}>
                  {" "}
                  Add Person
                </button>
                <br></br>
                <br></br>
                <input
                  type="text"
                  placeholder="room_id"
                  onChange={(event) => {
                    setRoom(event.target.value);
                  }}
                />
                <button className="btn btn-primary" onClick={joinRoom}>
                  Join Room
                </button>
              </>
            ) : (
              <ChatMessages
                socket={socket}
                username={user!.name}
                room={room}
                goBack={goBack}
              />
            )}
            <button
              className="btn btn-danger"
              onClick={() => setChatVisibility(!chatVisibility)}
            >
              {" "}
              Close Chat{" "}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
