//


export const SOCKET_PATH_PREFIX = "/internal/" + process.env["npm_package_version"];

type SocketSpecsFromServer = {
  greet: {
    message: {message: string}
  }
};

type SocketSpecsFromClient = {
  greet: {
    request: {name: string},
    response: {message: string}
  }
};

export type SocketProcessName = keyof SocketSpecsFromClient;
export type SocketMessageName = keyof SocketSpecsFromServer;

export type SocketRequestData<N extends SocketProcessName> = SocketSpecsFromClient[N]["request"];
export type SocketResponseData<N extends SocketProcessName> = SocketSpecsFromClient[N]["response"];
export type SocketResponseDataCallback<N extends SocketProcessName> = (body: SocketResponseData<N>) => void;

export type SocketMessageData<N extends SocketMessageName> = SocketSpecsFromServer[N]["message"];

export type SocketEventsFromServer = {[N in SocketMessageName]: (body: SocketMessageData<N>) => void};
export type SocketEventsFromClient = {[N in SocketProcessName]: (query: SocketRequestData<N>, callback: SocketResponseDataCallback<N>) => Promise<void>};