//

import type {
  Phrase as PhraseSkeleton
} from "/server/internal/skeleton";
import {
  Phrase
} from "/server/model";


export namespace PhraseCreator {

  export function skeletonize(raw: Phrase): PhraseSkeleton {
    const skeleton = {
      titles: raw.titles,
      form: raw.form,
      terms: raw.terms,
      termString: raw.termString ?? raw.terms.join(", "),
      ignoredPattern: raw.ignoredPattern
    } satisfies PhraseSkeleton;
    return skeleton;
  }

  export function enflesh(input: PhraseSkeleton): Phrase {
    const raw = {
      titles: input.titles,
      form: input.form,
      terms: input.terms,
      termString: input.termString,
      ignoredPattern: input.ignoredPattern
    } satisfies Phrase;
    return raw;
  }

}
