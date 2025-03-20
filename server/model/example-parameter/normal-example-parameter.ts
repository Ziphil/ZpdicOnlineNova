//

import {Dictionary} from "/server/model/dictionary/dictionary";
import {Example, ExampleModel} from "/server/model/example/example";
import {ExampleParameter} from "/server/model/example-parameter/example-parameter";
import {QueryLike} from "/server/util/query";


export class NormalExampleParameter extends ExampleParameter {

  public readonly kind: "normal";

  public constructor() {
    super();
    this.kind = "normal";
  }

  public createQuery(dictionary: Dictionary): QueryLike<Array<Example>, Example> {
    const sortKey = "-createdDate -number _id";
    const query = ExampleModel.findExist().where("dictionary", dictionary).sort(sortKey);
    return query;
  }

}