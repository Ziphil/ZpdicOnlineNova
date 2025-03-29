//

import Agenda from "agenda";


export class JobController {

  public static agenda: Agenda;

  protected agenda: Agenda;

  public constructor() {
    const constructor = this.constructor as typeof JobController;
    this.agenda = constructor.agenda;
  }

  public setup(): void {
  }

  public setupAfter(): void {
  }

  public static prepare(agenda: Agenda): void {
    this.agenda = agenda;
  }

  public static use(this: JobControllerConstructor, agenda: Agenda): void {
    this.prepare(agenda);
    const controller = new this();
    controller.setup();
    this.agenda.on("ready", () => {
      controller.setupAfter();
    });
  }

}


type JobControllerConstructor = (new() => JobController) & {prepare: (agenda: Agenda) => void, agenda: Agenda};