//

import type {
  Relation$Out
} from "/server/external/schema";
import {
  Relation
} from "/server/model";


export namespace RelationCreator {

  export function skeletonize(raw: Relation): Relation$Out {
    const skeleton = {
      titles: raw.titles,
      number: raw.number,
      name: raw.name
    } satisfies Relation$Out;
    return skeleton;
  }

}
