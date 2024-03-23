//


export const SOCKET_NAMESPACE = "/internal/" + process.env["npm_package_version"];

export type SocketSpecsFromServer = {
  greet: {
    response: {message: string}
  }
};

export type SocketSpecsFromClient = {
  greet: {
    request: {name: string},
    response: {message: string}
  }
};

export type EventName = keyof SocketSpecsFromClient;
export type MessageName = keyof SocketSpecsFromServer;

export type RequestData<N extends EventName> = SocketSpecsFromClient[N]["request"];
export type ResponseData<N extends EventName> = SocketSpecsFromClient[N]["response"];
export type ResponseDataCallback<N extends EventName> = (body: ResponseData<N>) => void;

export type MessageData<N extends MessageName> = SocketSpecsFromServer[N]["response"];

export type SocketEventsFromServer = {[N in MessageName]: (body: MessageData<N>) => void};
export type SocketEventsFromClient = {[N in EventName]: (query: RequestData<N>, callback: ResponseDataCallback<N>) => Promise<void>};