//

import {Agenda} from "agenda";
import {Express} from "express";
import {ExampleExternalRestController} from "./example";
import {WordExternalRestController} from "./word";


export function use(application: Express, agenda: Agenda): void {
  ExampleExternalRestController.use(application, agenda);
  WordExternalRestController.use(application, agenda);
}
