import { WebSocketServer, WebSocket } from "ws";
import { generateSecureID } from "./utilities";
interface Content {
  type: "text" | "image" | "audio";
  content: string;
}

interface UserData {
  userId: string;
  userName: string;
  socket: WebSocket;
}

interface RoomData {
  userDataArr?: UserData[];
  content?: Content[];
}

interface Payload {
  userData: UserData;
  content?: Content;
}

type MessageResponse = {
  readonly type: "create-room" | "chat" | "join-room";
  payload: Payload;
  roomId: string;
};
const wss = new WebSocketServer({ port: 8080 });

const allWebSocket: WebSocket[] = [];

const rooms = new Map<string, RoomData>();

wss.on("connection", function connection(socket) {
  socket.send("connected!")
  socket.on("error", console.error);

  socket.on("message", function message(data) {
    const parsedMessage: MessageResponse = JSON.parse(data.toString());

    if (parsedMessage.type == "create-room") {
      const roomId = generateSecureID();
      console.log("type create parsed response :", parsedMessage)
      rooms.set(roomId, parsedMessage.payload as RoomData);
      const createdRoom = {
        roomId,
      };
      socket.send(JSON.stringify(createdRoom));
    }
    if (parsedMessage.type == "join-room") {
      const currentRoom = rooms.get(parsedMessage.roomId);
      currentRoom &&
        currentRoom.userDataArr &&
        currentRoom.userDataArr.push(parsedMessage.payload.userData);
    }

    if (parsedMessage.type == "chat") {
      const currentRoom = rooms.get(parsedMessage.roomId);
      // saving data to save later
      parsedMessage.payload.content &&
        currentRoom?.content?.push(parsedMessage.payload.content);

        if(currentRoom?.userDataArr){
          for (let i = 0; i < currentRoom?.userDataArr.length; i++) {
            let s = currentRoom?.userDataArr[i];
            parsedMessage.payload.content && s.socket.send(parsedMessage.payload.content.toString());
          }
        }
    }

  });
});
