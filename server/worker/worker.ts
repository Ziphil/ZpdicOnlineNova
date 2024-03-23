//

import Agenda from "agenda";


export class Worker {

  protected agenda: Agenda;

  public constructor(agenda: Agenda) {
    this.agenda = agenda;
  }

  protected setup(): void {
  }

  public static use<W extends Worker>(this: new(agenda: Agenda) => W, agenda: Agenda): W {
    const worker = new this(agenda);
    worker.setup();
    return worker;
  }

}