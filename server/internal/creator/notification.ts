//

import type {
  Notification as NotificationSkeleton
} from "/client/skeleton";
import {
  Notification
} from "/server/model";


export namespace NotificationCreator {

  export function skeletonize(raw: Notification): NotificationSkeleton {
    const skeleton = {
      id: raw.id,
      type: raw.type,
      date: raw.date.toISOString(),
      title: raw.title,
      text: raw.text
    } satisfies NotificationSkeleton;
    return skeleton;
  }

}