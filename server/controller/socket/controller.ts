//

import {Express} from "express";
import {Namespace, Server, Socket} from "socket.io";
import {LogUtil} from "/server/util/log";


export class SocketController {

  protected application: Express;
  protected server: Server;
  protected namespace!: Namespace;
  protected socket!: Socket;

  public constructor(application: Express, server: Server) {
    this.application = application;
    this.server = server;
  }

  protected setup(): void {
  }

  protected setupConnection(socket: Socket): void {
  }

  public static use<C extends SocketController>(this: new(application: Express, server: Server) => C, application: Express, server: Server): void {
    const controller = new this(application, server);
    controller.setup();
    controller.namespace.on("connection", (socket) => {
      LogUtil.log("socket/connection", {id: socket.id});
      controller.setupConnection(socket);
    });
  }

}