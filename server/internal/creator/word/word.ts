//

import {ExampleCreator} from "/server/internal/creator/example/example";
import {SectionCreator} from "/server/internal/creator/word/section";
import type {
  EditableWord as EditableWordSkeleton,
  ObjectId,
  Word as WordSkeleton,
  WordWithExamples as WordSkeletonWithExamples
} from "/server/internal/skeleton";
import {
  EditableWord,
  ExampleModel,
  OldWord,
  Word
} from "/server/model";


export namespace WordCreator {

  export function skeletonize(raw: Word | OldWord): WordSkeleton {
    const skeleton = {
      id: (raw.id || raw["_id"]).toString() as ObjectId,
      number: raw.number,
      spelling: raw.name,
      pronunciation: raw.pronunciation ?? "",
      tags: raw.tags,
      sections: raw.sections.map(SectionCreator.skeletonize),
      updatedUser: (raw.updatedUser !== undefined) ? {
        id: raw.updatedUser.toString() as ObjectId
      } : undefined,
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
