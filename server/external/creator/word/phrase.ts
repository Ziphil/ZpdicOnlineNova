//

import type {
  Phrase$Out
} from "/server/external/schema";
import {
  Phrase
} from "/server/model";


export namespace PhraseCreator {

  export function skeletonize(raw: Phrase): Phrase$Out {
    const skeleton = {
      titles: raw.titles,
      form: raw.form,
      terms: raw.terms,
      termString: raw.termString ?? raw.terms.join(", "),
      ignoredPattern: raw.ignoredPattern ?? ""
    } satisfies Phrase$Out;
    return skeleton;
  }

  export function enflesh(input: Phrase$Out): Phrase {
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
