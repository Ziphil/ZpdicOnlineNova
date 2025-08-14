//

import {ExampleCreator} from "/server/external-alpha/creator/example/example";
import {SectionCreator} from "/server/external-alpha/creator/word/section";
import type {
  EditableWord$In,
  Word$Out,
  WordWithExamples$Out
} from "/server/external-alpha/schema";
import {
  EditableWord,
  ExampleModel,
  Word
} from "/server/model";


export namespace WordCreator {

  export function skeletonize(raw: Word): Word$Out {
    const skeleton = {
      id: raw.id || raw["_id"],
      number: raw.number,
      spelling: raw.name,
      pronunciation: raw.pronunciation ?? "",
      tags: raw.tags,
      sections: raw.sections.map(SectionCreator.skeletonize)
    } satisfies Word$Out;
    return skeleton;
  }

  export async function skeletonizeWithExamples(raw: Word): Promise<WordWithExamples$Out> {
    const base = skeletonize(raw);
    const examples = await ExampleModel.fetchByWord(raw).then((rawExamples) => rawExamples.map(ExampleCreator.skeletonize));
    const skeleton = {...base, examples};
    return skeleton;
  }

  export function enflesh(skeleton: EditableWord$In): Omit<EditableWord, "number"> {
    const raw = {
      name: skeleton.spelling,
      pronunciation: skeleton.pronunciation,
      tags: skeleton.tags,
      sections: skeleton.sections.map(SectionCreator.enflesh)
    } satisfies Omit<EditableWord, "number">;
    return raw;
  }

}
