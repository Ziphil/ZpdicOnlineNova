//

import {Agenda} from "agenda";
import {Express} from "express";
import {Server} from "socket.io";
import {ExampleExternalRestController} from "./example";
import {WordExternalRestController} from "./word";


export function use(application: Express, server: Server, agenda: Agenda): void {
  ExampleExternalRestController.use(application, server, agenda);
  WordExternalRestController.use(application, server, agenda);
}
