//

import {isDocument} from "@typegoose/typegoose";
import type {
  Example as ExampleSkeleton, ExampleWithDictionary
} from "/client/skeleton";
import {DictionaryCreator} from "/server/creator/dictionary/dictionary";
import {LinkedWordCreator} from "/server/creator/word/linked-word";
import {
  Example
} from "/server/model";


export namespace ExampleCreator {

  export function create(raw: Example): ExampleSkeleton {
    const id = raw.id;
    const number = raw.number;
    const words = raw.words.map(LinkedWordCreator.create);
    const sentence = raw.sentence;
    const translation = raw.translation;
    const offer = raw.offer?.toString();
    const skeleton = {id, number, words, sentence, translation, offer};
    return skeleton;
  }

  export async function createWithDictionary(raw: Example): Promise<ExampleWithDictionary> {
    const base = create(raw);
    const [dictionary] = await Promise.all([(async () => {
      await raw.populate("dictionary");
      if (isDocument(raw.dictionary)) {
        return DictionaryCreator.create(raw.dictionary);
      } else {
        throw new Error("cannot happen");
      }
    })()]);
    const skeleton = {...base, dictionary};
    return skeleton;
  }

}