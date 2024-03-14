//

import type {
  Notification as NotificationSkeleton
} from "/client/skeleton";
import {
  Notification
} from "/server/model";


export namespace NotificationCreator {

  export function create(raw: Notification): NotificationSkeleton {
    const id = raw.id;
    const type = raw.type;
    const date = raw.date.toISOString();
    const title = raw.title;
    const text = raw.text;
    const skeleton = {id, type, date, title, text};
    return skeleton;
  }

}