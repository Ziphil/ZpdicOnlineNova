//

import type {
  Relation$Out
} from "/server/external-preview/schema";
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

  export function enflesh(input: Relation$Out): Relation {
    const raw = {
      titles: input.titles,
      number: input.number,
      name: input.name
    } satisfies Relation;
    return raw;
  }

}
