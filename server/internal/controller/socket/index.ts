//

import {Agenda} from "agenda";
import {Express} from "express";
import {Server} from "socket.io";
import {DictionarySocketController} from "./dictionary";


export function use(application: Express, server: Server, agenda: Agenda): void {
  DictionarySocketController.use(application, server, agenda);
}