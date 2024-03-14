//

import type {
  History as HistorySkeleton
} from "/client/skeleton";
import {
  History
} from "/server/model";


export namespace HistoryCreator {

  export function create(raw: History): HistorySkeleton {
    const id = raw.id;
    const date = raw.date.toISOString();
    const wordSize = raw.wordSize;
    const skeleton = {id, date, wordSize};
    return skeleton;
  }

}