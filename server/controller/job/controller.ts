//

import Agenda from "agenda";


export class JobController {

  protected agenda: Agenda;

  public constructor(agenda: Agenda) {
    this.agenda = agenda;
  }

  protected setup(): void {
  }

  public static use<C extends JobController>(this: new(agenda: Agenda) => C, agenda: Agenda): C {
    const controller = new this(agenda);
    controller.setup();
    return controller;
  }

}