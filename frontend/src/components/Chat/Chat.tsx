// // import { IoMdChatboxes } from "react-icons/io";
// import { useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import io from "socket.io-client";
// import "./Chat.scss";
// import ChatMessages from "./ChatMessages";
// import { useUser } from "../../hooks/UserContext";
// import { User } from "../../models/User";

const socket = io("http://localhost:8080", {
  transports: ["websocket"],
});

const Chat = () => {
  //   return <IoMdChatboxes size={40} />;
  //somehow get the user_id here
  const { user } = useUser();
  const [userList, setUserList] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [chatVisibility, setChatVisibility] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [recentChatters, setRecentChatters] = useState<any[]>([]);
  const [currentSelectValue, setCurrentSelectValue] = useState("");
  // const [chat, setChat] = useState("");
  const [divIndexValue, setDivIndexValue] = useState(-1);
  // maybe make this change everytime userList is changed
  const getRecentChats = async () => {
    try {
      if (user != null) {
        const response = await fetch(`/api/chats/getChats/${user!.id}`);
        const chats = await response.json();
        setRecentChatters(chats);
      }
      // console.log("Chats:", chats);
    } catch (error) {
      console.error("Error fetching recent Chats", error);
    }
  };

  useEffect(() => {
    if (user != null) {
      setUsername(user!.name);
    } else {
      setUsername("");
    }
    const getAllUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to get all users");
        }
        const allUsers = await response.json();
        if (user != null) {
          const filteredAllUsers: User[] = allUsers.filter(
            (myUser: User) => myUser.id != user!.id
          );
          setUserList(filteredAllUsers);
        }
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    getRecentChats();
    getAllUsers();
  }, []);

  const addNewChat = async (chatName: any, userID: any, otherID: any) => {
    const response = await fetch("/api/chats/addChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatName: chatName,
        userID: userID,
        otherID: otherID,
      }),
    });
    if (response.ok) {
      //want to return the chatID
      console.log("response ok");
      // const myChat = await response.json();
      // console.log("addNewChat:", myChat);
      // setChat(myChat);
    } else {
      console.log("response not ok");
    }
  };

  useEffect(() => {
    // console.log("Username:", username);
    // console.log(room);
    if (username !== "" && room !== "") {
      // console.log("Going to join room!");
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }, [room, divIndexValue]);

  const joinRoom = (roomVal: string, index: number) => {
    setRoom(roomVal);
    setDivIndexValue(index);
    // console.log("Username:", username);
    // console.log(room);
    // if (username !== "" && room !== "") {
    //   console.log("Going to join room!");
    //   socket.emit("join_room", room);
    //   setShowChat(true);
    // }
  };

  const goBack = () => {
    setDivIndexValue(-1);
    setShowChat(false);
    setRoom("");
    //set div value back to -1 here
  };

  const updateValue = (event: any) => {
    setCurrentSelectValue(event.target.value);
  };
  const addChatter = async (event: any) => {
    //need to check if you haven't already added someone
    //use current select value to check in recent chatters
    //if already added, then alert the user
    event.preventDefault();

    //add to list of user_id, need to represent each with a div
    if (currentSelectValue != "") {
      const convertedSelectValue = JSON.parse(currentSelectValue);
      // console.log("CurrentSelectValue", currentSelectValue);
      const myName = uuidv4();
      await addNewChat(myName, user?.id, convertedSelectValue.id);
      // setRecentChatters((currentRecentChatters) => {
      //   return [...currentRecentChatters, chatterDetails];
      // });
    }
    getRecentChats();
    // Insert new chat into chats table, with a random chat name
    // Also add two different users to this new chat
    //then we can pull from database, all the users associated with this chat
    //add to list of recent chatters
    //this list of recent chatters gets refreshed and used to make the divs
    //when you click on div, it sends the chatID to the joinRoom
    //still need to pull from chats_users to get the information
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
                <form onSubmit={addChatter}>
                  <label htmlFor="selectUser">Add a User to chat with:</label>
                  <select
                    id="selectUser"
                    value={currentSelectValue}
                    onChange={updateValue}
                  >
                    <option value="">--Please choose an option--</option>
                    {userList.map((item, index) => (
                      <option key={index} value={JSON.stringify(item)}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-primary">
                    Add Person
                  </button>
                </form>
                <br></br>
                <br></br>
                {/* <input
                  type="text"
                  placeholder="room_id"
                  onChange={(event) => {
                    setRoom(event.target.value);
                  }}
                /> */}
                {/* <button className="btn btn-primary" onClick={joinRoom}>
                  Join Room
                </button> */}
                {recentChatters.map((item, index) => (
                  <div
                    className="recentChatters"
                    key={index}
                    onClick={() => joinRoom(item.chatID, index)}
                  >
                    Chat#
                    {item.chatID}
                    {item.users.map((person: any, userIndex: number) => (
                      <p key={userIndex}> {person.username}</p>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <ChatMessages
                socket={socket}
                username={username}
                chatID={room}
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

// export default Chat;
