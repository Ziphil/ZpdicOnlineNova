//

import type {
  Example as ExampleSkeleton
} from "/client/skeleton";
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

}