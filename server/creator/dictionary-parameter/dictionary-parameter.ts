//

import type {
  DictionaryParameter as DictionaryParameterSkeleton
} from "/client/skeleton";
import {
  DictionaryParameter,
  NormalDictionaryParameter
} from "/server/model";


export class DictionaryParameterCreator {

  public static recreate(skeleton: DictionaryParameterSkeleton): DictionaryParameter {
    const castSkeleton = skeleton;
    const raw = new NormalDictionaryParameter(castSkeleton.text, castSkeleton.userName, castSkeleton.order);
    return raw;
  }

}