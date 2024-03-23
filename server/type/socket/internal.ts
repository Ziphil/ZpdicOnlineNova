//


export const SOCKET_NAMESPACE = "/internal/" + process.env["npm_package_version"];

export type SocketSpecsFromServer = {
};

export type SocketSpecsFromClient = {
  greet: [
    {name: string},
    (message: string) => void
  ]
};

export type SocketEventsFromServer = {[N in keyof SocketSpecsFromServer]: (...args: SocketSpecsFromServer[N]) => void};
export type SocketEventsFromClient = {[N in keyof SocketSpecsFromClient]: (...args: SocketSpecsFromClient[N]) => Promise<void>};