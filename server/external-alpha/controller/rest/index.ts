//

import {Agenda} from "agenda";
import {Express} from "express";
import {WordExternalRestController} from "./word";


export function use(application: Express, agenda: Agenda): void {
  WordExternalRestController.use(application, agenda);
}
