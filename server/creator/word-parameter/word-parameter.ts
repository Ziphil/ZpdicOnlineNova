//

import type {
  WordParameter as WordParameterSkeleton
} from "/client/skeleton";
import {
  AdvancedWordParameter,
  AdvancedWordParameterElement,
  ExactWordParameter,
  NormalWordParameter,
  WordParameter
} from "/server/model";


export namespace WordParameterCreator {

  export function enflesh(skeleton: WordParameterSkeleton): WordParameter {
    if (skeleton.kind === "advanced") {
      const elements = skeleton.elements.map((element) => new AdvancedWordParameterElement(element.text, element.title, element.mode, element.type));
      const raw = new AdvancedWordParameter(elements);
      return raw;
    } else if (skeleton.kind === "exact") {
      const raw = new ExactWordParameter(skeleton.number);
      return raw;
    } else {
      const raw = new NormalWordParameter(skeleton.text, skeleton.mode, skeleton.type, skeleton.order, skeleton.options);
      return raw;
    }
  }

}