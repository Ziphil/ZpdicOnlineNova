//

import {Dictionary} from "/server/model/dictionary/dictionary";
import {Example, ExampleModel} from "/server/model/example/example";
import {ExampleParameter} from "/server/model/example-parameter/example-parameter";
import {QueryLike} from "/server/util/query";


export class ExactExampleParameter extends ExampleParameter {

  public readonly kind: "exact";
  public number: number;

  public constructor(number: number) {
    super();
    this.kind = "exact";
    this.number = number;
  }

  public createQuery(dictionary: Dictionary): QueryLike<Array<Example>, Example> {
    const query = ExampleModel.findExist().where("dictionary", dictionary).where("number", this.number);
    return query;
  }

}