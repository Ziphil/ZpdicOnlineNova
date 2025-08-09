//

import {Agenda} from "agenda";
import {DictionaryJobController} from "./dictionary";
import {RegularJobController} from "./regular";


export function use(agenda: Agenda): void {
  DictionaryJobController.use(agenda);
  RegularJobController.use(agenda);
}
