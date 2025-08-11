//

import type {
  Relation$In,
  Relation$Out
} from "/server/external-alpha/schema";
import {
  Relation
} from "/server/model";


export namespace RelationCreator {

  export function skeletonize(raw: Relation): Relation$Out {
    const skeleton = {
      titles: raw.titles,
      number: raw.number,
      spelling: raw.name
    } satisfies Relation$Out;
    return skeleton;
  }

  export function enflesh(input: Relation$In): Relation {
    const raw = {
      titles: input.titles,
      number: input.number,
      name: input.spelling
    } satisfies Relation;
    return raw;
  }

}
