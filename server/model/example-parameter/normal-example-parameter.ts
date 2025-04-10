//

import {Dictionary} from "/server/model/dictionary/dictionary";
import {Example, ExampleModel} from "/server/model/example/example";
import {ExampleIgnoreOptions, ExampleMode, ExampleParameter, ExampleType} from "/server/model/example-parameter/example-parameter";
import {QueryLike} from "/server/util/query";


export class NormalExampleParameter extends ExampleParameter {

  public readonly kind: "normal";
  public text: string;
  public mode: ExampleMode;
  public type: ExampleType;
  public options: NormalExampleParameterOptions;

  public constructor(text: string, mode: ExampleMode, type: ExampleType, options: NormalExampleParameterOptions) {
    super();
    this.kind = "normal";
    this.text = text;
    this.mode = mode;
    this.type = type;
    this.options = options;
  }

  public createQuery(dictionary: Dictionary): QueryLike<Array<Example>, Example> {
    const keys = ExampleParameter.createKeys(this.mode);
    const needle = ExampleParameter.createNeedle(this.text, this.type, this.options.ignore);
    const sortKey = "-createdDate -number _id";
    const disjunctFilters = keys.map((key) => ExampleModel.find().where(key, needle).getFilter());
    const query = ExampleModel.findExist().where("dictionary", dictionary["_id"]).or(disjunctFilters).sort(sortKey);
    return query;
  }

}


export type NormalExampleParameterOptions = {
  ignore: ExampleIgnoreOptions
};