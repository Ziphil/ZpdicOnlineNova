//

import {Socket, io} from "socket.io-client";
import {VERSION} from "/client/variable";
import type {SocketEventsFromClient, SocketEventsFromServer} from "/server/type/socket/internal";


export const SOCKET_NAMESPACE = "/internal/" + VERSION;

export const socket = io(SOCKET_NAMESPACE, {
  autoConnect: true
}) as Socket<SocketEventsFromServer, SocketEventsFromClient>;

socket.on("connect", () => {
  console.log("connect");
  socket.emit("greet", {name: "Debug"}, (message) => console.log(message));
});