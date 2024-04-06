// // import { IoMdChatboxes } from "react-icons/io";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.scss";
import ChatMessages from "./ChatMessages";
import { useUser } from "../../hooks/UserContext";
import { User } from "../../models/User";
import { api } from "../../api";
import Select, { MultiValue } from "react-select";

export class Option {
  value: string;
  label: string;
  additionalInfo: string;

  constructor(value: string, label: string, additionalInfo: string) {
    this.value = value;
    this.label = label;
    this.additionalInfo = additionalInfo;
  }
}

// const socket = io("wss://collabhub-dot-collabhub-418107.uc.r.appspot.com/");
const socket = io("http://localhost:8080", {
  transports: ["websocket"],
});

const Chat = () => {
  //   return <IoMdChatboxes size={40} />;
  //somehow get the user_id here
  const { user } = useUser();
  const [userList, setUserList] = useState<Option[]>([]);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [chatVisibility, setChatVisibility] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [recentChatters, setRecentChatters] = useState<any[]>([]);
  const [currentSelectValue, setCurrentSelectValue] = useState<
    MultiValue<Option>
  >([]);
  const [chatName, setChatName] = useState("");
  const [divIndexValue, setDivIndexValue] = useState(-1);
  const [usersForChat, setUsersForChat] = useState<User[]>([]);

  //get chats for a certain ID
  const getRecentChats = async () => {
    try {
      if (user != null) {
        const response = await api.get(`/chats/getChats/${user!.id}`);
        const chats = response.data;
        setRecentChatters(chats);
        console.log("Recent Chats:", chats);

        //trying to get chats that are project
        const check = await api.get(`/chats/getProjectChats/${user!.id}`);
        console.log("Check", check);
      }
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

    //get all users that have signed up
    const getAllUsers = async () => {
      try {
        const response = await api.get("/users");
        const users = response.data;
        if (user != null) {
          var filteredAllUsers: User[] = users.filter(
            (myUser: User) => myUser.id != user!.id && myUser.isAdmin != true
          );
          console.log("Filtered Users:", filteredAllUsers);
          //make the user list here, which will be used as the options thing later
          var options: Option[] = [];
          filteredAllUsers.forEach((myUser: User) => {
            var option: Option = new Option(
              JSON.stringify(myUser),
              myUser.name,
              myUser.username
            );
            //create the options you can choose from
            options.push(option);
          });
          setUserList(options);
        }
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };
    getRecentChats();
    getAllUsers();
    socket.on("refresh_user_list", getRecentChats);
  }, []);

  //add new chat to database
  const addNewChat = async (chatName: any, userID: any, otherIDs: any) => {
    try {
      const response = await api.post("/chats/addChat", {
        chatName: chatName,
        userID: userID,
        otherIDs: otherIDs,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error adding new chat", error);
    }
  };

  useEffect(() => {
    //user clicks on whichever chat they want, they will join the room
    if (username !== "" && room !== "") {
      // console.log("Going to join room!");
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }, [room, divIndexValue]);

  const joinRoom = (
    roomVal: string,
    index: number,
    chatName: string,
    users: User[]
  ) => {
    //changing these two triggers useEffect above
    setRoom(roomVal);
    setDivIndexValue(index);
    setChatName(chatName);
    setUsersForChat(users);
    console.log("Users for chat when joining room:", usersForChat);
  };
  //when returning from the chat, update the users listed for each chat
  const changeMembersOfChat = (chatID: string, membersOfChat: User[]) => {
    //find the object in recentChatters, replace its users
    const myObject = recentChatters.find((item) => item.chatID === chatID);
    if (myObject != null) {
      myObject.users = membersOfChat;
    }
    console.log("my object: ", myObject);
  };
  //reset values when you click the goBack button
  const goBack = () => {
    setDivIndexValue(-1);
    changeMembersOfChat(room, usersForChat);
    setShowChat(false);
    setRoom("");
    setChatName("");
    setUsersForChat([]);
  };

  //keep track of selected options from user
  const updateValue = (selectedOptions: MultiValue<Option>) => {
    setCurrentSelectValue(selectedOptions);
  };

  const addChatter = async (event: any) => {
    //need to check if you haven't already added someone
    //use current select value to check in recent chatters
    //if already added, then alert the user
    event.preventDefault();
    console.log("CurrentSelectValue", currentSelectValue);
    if (chatName.trim() == "") {
      alert("Please re-enter your chat name.");
    }

    //add to list of user_id, need to represent each with a div
    if (currentSelectValue.length > 0) {
      let convertedArray: Option[] = [];
      currentSelectValue.forEach((selectValue: Option) => {
        var option: Option = selectValue as Option;
        convertedArray.push(JSON.parse(option.value).id);
      });
      await addNewChat(chatName, user?.id, convertedArray);
      socket.emit("chat_added");
    } else {
      alert("Please add some users to your chat.");
    }
    getRecentChats();
  };
  //set chat name
  const handleChatNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(event.target.value);
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
                  <label htmlFor="selectUser">Create a Chat:</label>
                  <Select
                    isMulti
                    name="selectUsers"
                    options={userList}
                    onChange={updateValue}
                    getOptionLabel={(option: Option) =>
                      `${option.label}, ${option.additionalInfo}`
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                  <input
                    type="text"
                    value={chatName}
                    onChange={handleChatNameChange}
                    placeholder="Insert chat name here:"
                    required
                  ></input>
                  <button type="submit" className="btn btn-primary">
                    Create Chat
                  </button>
                </form>
                <br></br>
                <br></br>
                {recentChatters.map((item, index) => (
                  <div
                    className="recentChatters"
                    key={index}
                    onClick={() =>
                      joinRoom(item.chatID, index, item.chatName, item.users)
                    }
                  >
                    {item.chatName}
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
                chatName={chatName}
                members={usersForChat}
                setMembers={setUsersForChat}
                userList={userList}
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
