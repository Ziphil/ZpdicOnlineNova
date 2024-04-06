//

import {ExampleOffer, ExampleOfferModel} from "/server/model/example/example-offer";
import {ExampleOfferParameter} from "/server/model/example-offer-parameter/example-offer-parameter";
import {QueryLike} from "/server/util/query";


export class NormalExampleOfferParameter extends ExampleOfferParameter {

  public readonly kind: "normal";
  public positionName: string | null;

  public constructor(positionName: string | null) {
    super();
    this.kind = "normal";
    this.positionName = positionName;
  }

  public createQuery(): QueryLike<Array<ExampleOffer>, ExampleOffer> {
    if (this.positionName !== null) {
      const sortKey = (this.positionName === "zpdicDaily") ? "position.name -position.index _id" : "position.name position.index _id";
      const query = ExampleOfferModel.where("position.name", this.positionName).sort(sortKey);
      return query;
    } else {
      const query = ExampleOfferModel.find().sort("position.name position.index _id");
      return query;
    }
  }

}