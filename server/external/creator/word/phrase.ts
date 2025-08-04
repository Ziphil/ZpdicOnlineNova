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

}
