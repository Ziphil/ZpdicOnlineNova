//

import {Dictionary} from "/server/model/dictionary/dictionary";
import {Example} from "/server/model/example/example";
import {QueryLike} from "/server/util/query";


export abstract class ExampleParameter {

  public abstract createQuery(dictionary: Dictionary): QueryLike<Array<Example>, Example>;

}