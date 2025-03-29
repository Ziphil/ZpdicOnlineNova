//

import Agenda from "agenda";
import {Express} from "express";
import {Namespace, Server, Socket} from "socket.io";


export class SocketController {

  public static application: Express;
  public static server: Server;
  public static agenda: Agenda;
  public static namespace: Namespace;

  protected application: Express;
  protected server: Server;
  protected agenda: Agenda;
  protected namespace: Namespace;
  protected socket: Socket;

  public constructor(socket: Socket) {
    const constructor = this.constructor as typeof SocketController;
    this.application = constructor.application;
    this.server = constructor.server;
    this.agenda = constructor.agenda;
    this.namespace = constructor.namespace;
    this.socket = socket;
  }

  public setup(): void {
  }

  public static prepare(application: Express, server: Server, agenda: Agenda): void {
    this.application = application;
    this.server = server;
    this.agenda = agenda;
  }

  public static use(this: SocketControllerConstructor, application: Express, server: Server, agenda: Agenda): void {
    this.prepare(application, server, agenda);
    this.namespace.on("connection", (socket) => {
      const controller = new this(socket);
      controller.setup();
    });
  }

}


type SocketControllerConstructor = (new(socket: Socket) => SocketController) & {prepare: (application: Express, server: Server, agenda: Agenda) => void, namespace: Namespace};