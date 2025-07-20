//

import type {
  Phrase as PhraseSkeleton
} from "/client/skeleton";
import {
  Phrase
} from "/server/model";


export namespace PhraseCreator {

  export function skeletonize(raw: Phrase): PhraseSkeleton {
    const skeleton = {
      titles: raw.titles,
      form: raw.form,
      translations: raw.translations,
      translationString: raw.translationString ?? raw.translations.join(", "),
      ignoredPattern: raw.ignoredPattern
    } satisfies PhraseSkeleton;
    return skeleton;
  }

}
