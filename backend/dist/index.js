"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const utilities_1 = require("./utilities");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const allWebSocket = [];
const rooms = new Map();
wss.on("connection", function connection(socket) {
    socket.send("connected!");
    socket.on("error", console.error);
    socket.on("message", function message(data) {
        var _a;
        const parsedMessage = JSON.parse(data.toString());
        if (parsedMessage.type == "create-room") {
            const roomId = (0, utilities_1.generateSecureID)();
            console.log("type create parsed response :", parsedMessage);
            rooms.set(roomId, parsedMessage.payload);
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
                ((_a = currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.content) === null || _a === void 0 ? void 0 : _a.push(parsedMessage.payload.content));
            if (currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.userDataArr) {
                for (let i = 0; i < (currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.userDataArr.length); i++) {
                    let s = currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.userDataArr[i];
                    parsedMessage.payload.content && s.socket.send(parsedMessage.payload.content.toString());
                }
            }
        }
    });
});
