//

import Agenda from "agenda";
import {Express, Router} from "express";


export class RestController {

  public static application: Express;
  public static agenda: Agenda;
  public static router: Router;

  protected application: Express;
  protected agenda: Agenda;
  protected router: Router;

  public constructor() {
    const constructor = this.constructor as typeof RestController;
    this.application = constructor.application;
    this.agenda = constructor.agenda;
    this.router = constructor.router;
  }

  public setup(): void {
  }

  public static prepare(application: Express, agenda: Agenda): void {
    this.application = application;
    this.agenda = agenda;
  }

  public static use(this: RestControllerConstructor, application: Express, agenda: Agenda): void {
    this.prepare(application, agenda);
    const controller = new this();
    controller.setup();
  }

}


type RestControllerConstructor = (new() => RestController) & {prepare: (application: Express, agenda: Agenda) => void};