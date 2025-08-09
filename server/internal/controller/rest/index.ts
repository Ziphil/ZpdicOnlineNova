//

import {Agenda} from "agenda";
import {Express} from "express";
import {Server} from "socket.io";
import {ArticleRestController} from "./article";
import {DebugRestController} from "./debug";
import {DictionaryRestController} from "./dictionary";
import {ExampleRestController} from "./example";
import {HistoryRestController} from "./history";
import {InvitationRestController} from "./invitation";
import {NotificationRestController} from "./notification";
import {OtherRestController} from "./other";
import {ProposalRestController} from "./proposal";
import {ResourceRestController} from "./resource";
import {UserRestController} from "./user";
import {WordRestController} from "./word";


export function use(application: Express, server: Server, agenda: Agenda): void {
  ProposalRestController.use(application, server, agenda);
  DictionaryRestController.use(application, server, agenda);
  ExampleRestController.use(application, server, agenda);
  ArticleRestController.use(application, server, agenda);
  HistoryRestController.use(application, server, agenda);
  InvitationRestController.use(application, server, agenda);
  NotificationRestController.use(application, server, agenda);
  OtherRestController.use(application, server, agenda);
  ResourceRestController.use(application, server, agenda);
  UserRestController.use(application, server, agenda);
  WordRestController.use(application, server, agenda);
  DebugRestController.use(application, server, agenda);
}