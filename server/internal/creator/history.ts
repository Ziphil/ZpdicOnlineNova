//

import type {
  History as HistorySkeleton
} from "/server/internal/skeleton";
import {
  History
} from "/server/model";


export namespace HistoryCreator {

  export function skeletonize(raw: History): HistorySkeleton {
    const skeleton = {
      id: raw.id,
      date: raw.date.toISOString(),
      wordSize: raw.wordSize
    } satisfies HistorySkeleton;
    return skeleton;
  }

}