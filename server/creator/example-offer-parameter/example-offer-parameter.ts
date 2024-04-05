//

import type {
  ExampleOfferParameter as ExampleOfferParameterSkeleton
} from "/client/skeleton";
import {
  ExampleOfferParameter,
  NormalExampleOfferParameter
} from "/server/model";


export class ExampleOfferParameterCreator {

  public static recreate(skeleton: ExampleOfferParameterSkeleton): ExampleOfferParameter {
    const castSkeleton = skeleton;
    const raw = new NormalExampleOfferParameter(castSkeleton.positionName);
    return raw;
  }

}