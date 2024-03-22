// // a lot of code taken from: https://www.youtube.com/watch?v=NU-HfZY3ATQ&t=610s
// import ScrollToBottom from "react-scroll-to-bottom";
// import { useEffect, useState } from "react";
// import "./ChatMessages.scss";
// import { Socket } from "socket.io-client";
// import { useUser } from "../../hooks/UserContext";
// interface Props {
//   socket: Socket;
//   username: String;
//   chatID: String;
//   goBack: () => void;
// }

// function ChatMessages({ socket, username, chatID, goBack }: Props) {
//   const { user } = useUser();
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [messageList, setMessageList] = useState<any[]>([]);
//   //insert message into messages table, need chat_id, and user_id, and message_text
//   //pull from the database the past messages

//   const addNewMessage = async (chatID: String, userID: any, text: String) => {
//     //get current time
//     var currentDate = new Date();
//     // console.log(currentDate);
//     const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/chats/addMessage`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         chatID: chatID,
//         userID: userID,
//         text: text,
//         date: currentDate,
//       }),
//     });
//     if (response.ok) {
//       //want to return the chatID
//       console.log("response ok");
//       // const myMessage = await response.json();
//       // console.log("addNewMessage:", myMessage);
//     } else {
//       console.log("response not ok");
//     }
//   };

//   const getMessagesFromChatID = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/chats/getMessagesFromChat/${chatID}`);
//       const messages = await response.json();
//       setMessageList(messages);
//       // console.log("Messages:", messages);
//     } catch (error) {
//       console.error("Error fetching messages", error);
//     }
//   };

//   const sendMessage = async () => {
//     if (currentMessage !== "") {
//       // const messageData = {
//       //   chatID: chatID,
//       //   author: username,
//       //   message: currentMessage,
//       //   timeSent:
//       //     new Date(Date.now()).getHours() +
//       //     ":" +
//       //     new Date(Date.now()).getMinutes(),
//       // };
//       await addNewMessage(chatID, user?.id, currentMessage);
//       socket.emit("send_message", chatID);
//       await getMessagesFromChatID();
//       // setMessageList((list) => [...list, messageData]);
//       setCurrentMessage("");
//     }
//   };

//   //when change in socket server
//   useEffect(() => {
//     socket.off("receive_message").on("receive_message", async () => {
//       // setMessageList((list) => [...list, data]);
//       //get the message list from the correct id
//       await getMessagesFromChatID();
//     });
//   }, [socket]);

//   useEffect(() => {
//     getMessagesFromChatID();
//   }, []);

//   function convertTime(isoString: string) {
//     var date = new Date(isoString);
//     // console.log(date.getHours());
//     return (
//       date.getHours() +
//       ":" +
//       (date.getMinutes() < 10 ? "0" : "") +
//       date.getMinutes()
//     );
//   }
//   return (
//     <div>
//       <div className="chat-window">
//         <div className="chat-header">
//           <button id="backButton" className="btn btn-primary" onClick={goBack}>
//             GO BACK
//           </button>
//           <p> Live Chat</p>
//         </div>
//         <div className="chat-body">
//           <ScrollToBottom className="message-container">
//             {messageList.map((messageContent, index) => {
//               return (
//                 <div
//                   className="message"
//                   id={username == messageContent.User.name ? "other" : "you"}
//                   key={index}
//                 >
//                   <div>
//                     <div className="message-content">
//                       <p>{messageContent.message}</p>{" "}
//                     </div>
//                     <div className="message-meta">
//                       <p id="time">{convertTime(messageContent.date)}</p>
//                       <p id="author">{messageContent.User.name}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </ScrollToBottom>
//         </div>
//         <div className="chat-footer">
//           <input
//             type="text"
//             value={currentMessage}
//             placeholder="Insert Chat here..."
//             onChange={(event) => {
//               setCurrentMessage(event.target.value);
//             }}
//             onKeyPress={(event) => {
//               event.key === "Enter" && sendMessage();
//             }}
//           />
//           <button onClick={sendMessage}>&#9658;</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatMessages;
