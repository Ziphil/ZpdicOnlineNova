//

import type {
  TemplatePhrase as TemplatePhraseSkeleton
} from "/server/internal/skeleton";
import {
  TemplatePhrase
} from "/server/model";


export namespace TemplatePhraseCreator {

  export function skeletonize(raw: TemplatePhrase): TemplatePhraseSkeleton {
    const skeleton = {
      titles: raw.titles,
      form: raw.form,
      termString: raw.termString
    } satisfies TemplatePhraseSkeleton;
    return skeleton;
  }

}