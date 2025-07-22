//

import type {
  DictionaryParameter as DictionaryParameterSkeleton
} from "/server/internal/skeleton";
import {
  DictionaryParameter,
  NormalDictionaryParameter
} from "/server/model";


export namespace DictionaryParameterCreator {

  export function enflesh(skeleton: DictionaryParameterSkeleton): DictionaryParameter {
    const raw = new NormalDictionaryParameter(skeleton.text, skeleton.userName, skeleton.order);
    return raw;
  }

}