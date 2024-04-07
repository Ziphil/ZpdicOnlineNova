//

import type {
  DictionaryParameter as DictionaryParameterSkeleton
} from "/client/skeleton";
import {
  DictionaryParameter,
  NormalDictionaryParameter
} from "/server/model";


export class DictionaryParameterCreator {

  public static enflesh(skeleton: DictionaryParameterSkeleton): DictionaryParameter {
    const raw = new NormalDictionaryParameter(skeleton.text, skeleton.userName, skeleton.order);
    return raw;
  }

}