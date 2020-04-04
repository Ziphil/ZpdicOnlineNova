//

import {
  NotificationDocument
} from "/server/model/notification";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class NotificationSkeleton extends Skeleton {

  public id!: string;
  public type!: string;
  public date!: string;
  public title!: string;
  public text!: string;

  public static from(raw: NotificationDocument): NotificationSkeleton {
    let id = raw.id;
    let type = raw.type;
    let date = raw.date.toISOString();
    let title = raw.title;
    let text = raw.text;
    let skeleton = NotificationSkeleton.of({id, type, date, title, text});
    return skeleton;
  }

}