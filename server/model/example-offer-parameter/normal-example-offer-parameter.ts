//

import {ExampleOffer, ExampleOfferModel} from "/server/model/example-offer/example-offer";
import {ExampleOfferParameter} from "/server/model/example-offer-parameter/example-offer-parameter";
import {QueryLike} from "/server/util/query";


export class NormalExampleOfferParameter extends ExampleOfferParameter {

  public readonly kind: "normal";
  public catalog: string | null;

  public constructor(catalog: string | null) {
    super();
    this.kind = "normal";
    this.catalog = catalog;
  }

  public createQuery(): QueryLike<Array<ExampleOffer>, ExampleOffer> {
    if (this.catalog !== null) {
      const sortKey = (this.catalog === "zpdicDaily") ? "catalog -number _id" : "catalog number _id";
      const query = ExampleOfferModel.where("catalog", this.catalog).sort(sortKey);
      return query;
    } else {
      const query = ExampleOfferModel.find().sort("catalog number _id");
      return query;
    }
  }

}