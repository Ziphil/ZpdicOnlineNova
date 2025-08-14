//

import {Agenda} from "agenda";
import {Express} from "express";
import {Server} from "socket.io";
import {WordExternalRestController} from "./word";


export function use(application: Express, server: Server, agenda: Agenda): void {
  WordExternalRestController.use(application, server, agenda);
}
