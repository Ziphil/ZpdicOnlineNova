//

import type {
  WordParameter as WordParameterSkeleton
} from "/client/skeleton";
import {
  AdvancedWordParameter,
  AdvancedWordParameterElement,
  NormalWordParameter,
  WordParameter
} from "/server/model";


export namespace WordParameterCreator {

  export function recreate(skeleton: WordParameterSkeleton): WordParameter {
    if ("elements" in skeleton) {
      const elements = skeleton.elements.map((element) => new AdvancedWordParameterElement(element.text, element.title, element.mode, element.type));
      const raw = new AdvancedWordParameter(elements);
      return raw;
    } else {
      const raw = new NormalWordParameter(skeleton.text, skeleton.mode, skeleton.type, skeleton.order, skeleton.options);
      return raw;
    }
  }

}