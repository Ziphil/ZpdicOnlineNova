//

import {
  NotificationDocument
} from "/server/model/notification";
import {
  Skeleton
} from "/server/skeleton/skeleton";


export class NotificationSkeleton extends Skeleton {

  public id!: string;
  public title!: string;
  public date!: string;
  public text!: string;

  public static from(raw: NotificationDocument): NotificationSkeleton {
    let id = raw.id;
    let title = raw.title;
    let date = raw.date.toISOString();
    let text = raw.text;
    let skeleton = NotificationSkeleton.of({id, title, date, text});
    return skeleton;
  }

}