import { useEffect, useState } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [sendMessage, setSendMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messageArray, setMessageArray] = useState<string[]>([]);
  const [userId, setUserId] = useState("")
  const [roomId, setRoomId] = useState("")
  const handleSendMessage = () => {
    if (sendMessage && socket) {
      const reqBody = {
        type: "chat",
        payload: {
          userData: {
            userId,
            userName,
          },
          content: {
            content: sendMessage
          }
        },
      };
      socket.send(JSON.stringify(reqBody));
    }
  };
  const creatRoom = () => {
    if (socket) {
      const newUserId = uuidv4()
      const reqBody = {
        type: "create-room",
        payload: {
          userData: {
            userId: newUserId,
            userName
          },
        },
      };
      setUserId(newUserId)
      socket.send(JSON.stringify(reqBody));
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (ev) => {
      const parsedJSON = JSON.parse(ev.data)
      if(parsedJSON && parsedJSON?.roomId ){
        setRoomId(parsedJSON?.roomId as string);
      }else{
        setMessageArray((prev) => [...prev, ev.data]);
      }
    };
  }, []);
  return (
    <>
  {roomId && <p>your room Id: {roomId}</p>}
      <input
        type="text"
        id=""
        onChange={(e) => setUserName(e.currentTarget.value)}
        value={userName}
      />
      <button onClick={creatRoom}>Create Room </button>
      <div className="message-container">
        {messageArray.length > 0 &&
          messageArray.map((message) => <p className="message">{message}</p>)}
      </div>
      <div className="message">
        <input
          type="text"
          onChange={(e) => setSendMessage(e.currentTarget.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </>
  );
}

export default App;
