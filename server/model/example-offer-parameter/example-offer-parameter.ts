//

import {ExampleOffer} from "/server/model/example-offer/example-offer";
import {QueryLike} from "/server/util/query";


export abstract class ExampleOfferParameter {

  public abstract createQuery(): QueryLike<Array<ExampleOffer>, ExampleOffer>;

}