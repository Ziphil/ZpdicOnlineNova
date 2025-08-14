//

import {ExampleCreator} from "/server/internal/creator/example/example";
import {SectionCreator} from "/server/internal/creator/word/section";
import type {
  EditableWord as EditableWordSkeleton,
  Word as WordSkeleton,
  WordWithExamples as WordSkeletonWithExamples
} from "/server/internal/skeleton";
import {
  EditableWord,
  ExampleModel,
  Word
} from "/server/model";


export namespace WordCreator {

  export function skeletonize(raw: Word): WordSkeleton {
    const skeleton = {
      id: raw.id || raw["_id"],
      number: raw.number,
      spelling: raw.name,
      pronunciation: raw.pronunciation ?? "",
      tags: raw.tags,
      sections: raw.sections.map(SectionCreator.skeletonize),
      updatedUser: (raw.updatedUser !== undefined) ? {id: raw.updatedUser} : undefined,
      createdDate: raw.createdDate?.toISOString() ?? undefined,
      updatedDate: raw.updatedDate?.toISOString() ?? undefined
    } satisfies WordSkeleton;
    return skeleton;
  }

  export async function skeletonizeWithExamples(raw: Word): Promise<WordSkeletonWithExamples> {
    const base = skeletonize(raw);
    const examples = await ExampleModel.fetchByWord(raw).then((rawExamples) => rawExamples.map(ExampleCreator.skeletonize));
    const skeleton = {...base, examples};
    return skeleton;
  }

  export function enflesh(input: EditableWordSkeleton): EditableWord {
    const raw = {
      number: input.number,
      name: input.spelling,
      pronunciation: input.pronunciation,
      tags: input.tags,
      sections: input.sections.map(SectionCreator.enflesh)
    } satisfies EditableWord;
    return raw;
  }

}
