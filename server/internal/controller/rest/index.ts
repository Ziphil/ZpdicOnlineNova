//

import {Agenda} from "agenda";
import {Express} from "express";
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


export function use(application: Express, agenda: Agenda): void {
  ProposalRestController.use(application, agenda);
  DictionaryRestController.use(application, agenda);
  ExampleRestController.use(application, agenda);
  ArticleRestController.use(application, agenda);
  HistoryRestController.use(application, agenda);
  InvitationRestController.use(application, agenda);
  NotificationRestController.use(application, agenda);
  OtherRestController.use(application, agenda);
  ResourceRestController.use(application, agenda);
  UserRestController.use(application, agenda);
  WordRestController.use(application, agenda);
  DebugRestController.use(application, agenda);
}