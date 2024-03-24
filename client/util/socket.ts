//

import {io} from "socket.io-client";
import {VERSION} from "/client/variable";
import type {SocketMessageData, SocketMessageName, SocketProcessName, SocketRequestData, SocketResponseData} from "/server/type/socket/internal";


export const SOCKET_PATH_PREFIX = "/internal/" + VERSION;

const socket = io(SOCKET_PATH_PREFIX, {autoConnect: true});

export function requestSocket<N extends SocketProcessName>(name: N, data: SocketRequestData<N>): Promise<SocketResponseData<N>> {
  const promise = new Promise<SocketResponseData<N>>((resolve) => {
    socket.emit(name, data, resolve);
  });
  return promise;
}

export function listenSocket<N extends SocketMessageName>(name: N, listener: (data: SocketMessageData<N>) => void): () => void {
  socket.on(name, listener as any);
  const unlisten = function (): void {
    socket.off(name, listener as any);
  };
  return unlisten;
}

socket.onAny((event, ...args) => {
  console.log(event, args);
});