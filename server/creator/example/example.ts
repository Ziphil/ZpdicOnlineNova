//

import {isDocument} from "@typegoose/typegoose";
import type {
  Example as ExampleSkeleton,
  ExampleWithDictionary as ExampleSkeletonWithDictionary
} from "/client/skeleton";
import {DictionaryCreator} from "/server/creator/dictionary/dictionary";
import {LinkedWordCreator} from "/server/creator/word/linked-word";
import {
  Example
} from "/server/model";


export namespace ExampleCreator {

  export function skeletonize(raw: Example): ExampleSkeleton {
    const id = raw.id || raw["_id"];
    const number = raw.number;
    const words = raw.words.map(LinkedWordCreator.skeletonize);
    const sentence = raw.sentence;
    const translation = raw.translation;
    const supplement = raw.supplement;
    const offer = raw.offer?.toString();
    const skeleton = {id, number, words, sentence, translation, supplement, offer};
    return skeleton;
  }

  export async function skeletonizeWithDictionary(raw: Example): Promise<ExampleSkeletonWithDictionary> {
    const base = skeletonize(raw);
    const [dictionary] = await Promise.all([(async () => {
      if ("popluatedDictionary" in raw) {
        return DictionaryCreator.skeletonize(raw.popluatedDictionary as any);
      } else {
        await raw.populate("dictionary");
        if (isDocument(raw.dictionary)) {
          return DictionaryCreator.skeletonize(raw.dictionary);
        } else {
          throw new Error("cannot happen");
        }
      }
    })()]);
    const skeleton = {...base, dictionary};
    return skeleton;
  }

}