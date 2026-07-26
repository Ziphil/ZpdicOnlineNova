//

import type {
  NormalWordParameter as NormalWordParameterSkeleton
} from "/server/internal/skeleton";
import {NormalWordParameter} from "/server/model";


export namespace NormalWordParameterCreator {

  export function enflesh(skeleton: NormalWordParameterSkeleton): NormalWordParameter {
    const raw = new NormalWordParameter(skeleton.text, skeleton.mode, skeleton.type, skeleton.order, skeleton.options);
    return raw;
  }

}
