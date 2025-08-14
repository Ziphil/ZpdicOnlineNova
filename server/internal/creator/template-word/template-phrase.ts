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
      expression: raw.form,
      termString: raw.termString
    } satisfies TemplatePhraseSkeleton;
    return skeleton;
  }

  export function enflesh(skeleton: TemplatePhraseSkeleton): TemplatePhrase {
    const raw = {
      titles: skeleton.titles,
      form: skeleton.expression,
      termString: skeleton.termString
    } satisfies TemplatePhrase;
    return raw;
  }

}