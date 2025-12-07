//

import type {
  Phrase$In,
  Phrase$Out
} from "/server/external-alpha/schema";
import {
  Phrase
} from "/server/model";


export namespace PhraseCreator {

  export function skeletonize(raw: Phrase): Phrase$Out {
    const skeleton = {
      titles: raw.titles,
      expression: raw.form,
      terms: raw.terms,
      termString: raw.termString ?? raw.terms.join(", "),
      ignoredPattern: raw.ignoredPattern ?? "",
      text: raw.text ?? "",
      hidden: raw.hidden ?? false
    } satisfies Phrase$Out;
    return skeleton;
  }

  export function enflesh(input: Phrase$In): Phrase {
    const raw = {
      titles: input.titles,
      form: input.expression,
      terms: input.terms,
      termString: input.termString,
      ignoredPattern: input.ignoredPattern,
      text: input.text,
      hidden: input.hidden
    } satisfies Phrase;
    return raw;
  }

}
