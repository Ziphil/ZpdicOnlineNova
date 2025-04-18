//

import Agenda from "agenda";
import {Express, Router} from "express";
import {Namespace, Server} from "socket.io";


export class RestController<E extends [Record<string, any>, Record<string, any>] = any> {

  public static application: Express;
  public static server: Server;
  public static agenda: Agenda;
  public static router: Router;
  public static namespace?: Namespace;

  protected application: Express;
  protected server: Server;
  protected agenda: Agenda;
  protected router: Router;
  protected namespace?: Namespace<E[0], E[1]>;

  public constructor() {
    const constructor = this.constructor as typeof RestController;
    this.application = constructor.application;
    this.server = constructor.server;
    this.agenda = constructor.agenda;
    this.router = constructor.router;
    this.namespace = constructor.namespace;
  }

  public setup(): void {
  }

  public static prepare(application: Express, server: Server, agenda: Agenda): void {
    this.application = application;
    this.server = server;
    this.agenda = agenda;
  }

  public static use(this: RestControllerConstructor, application: Express, server: Server, agenda: Agenda): void {
    this.prepare(application, server, agenda);
    const controller = new this();
    controller.setup();
  }

}


type RestControllerConstructor = (new() => RestController) & {prepare: (application: Express, server: Server, agenda: Agenda) => void};