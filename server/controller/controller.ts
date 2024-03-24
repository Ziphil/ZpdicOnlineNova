//

import Agenda from "agenda";
import {Express, Router} from "express";
import {Namespace, Server, Socket} from "socket.io";
import {LogUtil} from "/server/util/log";


export class Controller {

  protected application: Express;
  protected server: Server;
  protected agenda: Agenda;

  protected router!: Router;
  protected namespace!: Namespace;
  protected socket!: Socket;

  protected restConfig?: {path: string};
  protected socketConfig?: {path: string};

  public constructor(application: Express, server: Server, agenda: Agenda) {
    this.application = application;
    this.server = server;
    this.agenda = agenda;
  }

  protected setup(): void {
  }

  protected setupConnection(socket: Socket): void {
  }

  public static use<C extends Controller>(this: new(application: Express, server: Server, agenda: Agenda) => C, application: Express, server: Server, agenda: Agenda): void {
    const controller = new this(application, server, agenda);
    controller.setup();
    if (controller.socketConfig !== undefined) {
      controller.namespace.on("connection", (socket) => {
        LogUtil.log("socket/connection", {id: socket.id});
        controller.setupConnection(socket);
      });
    }
  }

}