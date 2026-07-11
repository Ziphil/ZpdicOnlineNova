//

import type {
  Notification as NotificationSkeleton,
  ObjectId
} from "/server/internal/skeleton";
import {
  Notification
} from "/server/model";


export namespace NotificationCreator {

  export function skeletonize(raw: Notification): NotificationSkeleton {
    const skeleton = {
      id: raw.id.toString() as ObjectId,
      type: raw.type,
      date: raw.date.toISOString(),
      title: raw.title,
      text: raw.text
    } satisfies NotificationSkeleton;
    return skeleton;
  }

}