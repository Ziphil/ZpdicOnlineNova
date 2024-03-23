//

import {io} from "socket.io-client";
import {VERSION} from "/client/variable";
import type {EventName, MessageData, MessageName, RequestData, ResponseData} from "/server/type/socket/internal";


export const SOCKET_NAMESPACE = "/internal/" + VERSION;

const socket = io(SOCKET_NAMESPACE, {autoConnect: true});

socket.on("connect", () => {
  console.log("connect");
  send("greet", {name: "world"}).then((response) => {
    console.log(response.message);
  });
  listen("greet", (data) => {
    console.log(data.message);
  });
});

export function send<N extends EventName>(name: N, data: RequestData<N>): Promise<ResponseData<N>> {
  const promise = new Promise<ResponseData<N>>((resolve) => {
    socket.emit(name, data, resolve);
  });
  return promise;
}

export function listen<N extends MessageName>(name: N, listener: (data: MessageData<N>) => void): () => void {
  socket.on(name, listener as any);
  const unlisten = function (): void {
    socket.off(name, listener as any);
  };
  return unlisten;
}