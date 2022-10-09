//

import {
  Dictionary,
  DictionaryModel
} from "/server/model/dictionary";
import {
  DictionaryOrder,
  DictionaryParameter
} from "/server/model/dictionary/dictionary-parameter/dictionary-parameter";
import {
  escapeRegexp
} from "/server/util/misc";
import {
  QueryLike
} from "/server/util/query";


export class NormalDictionaryParameter extends DictionaryParameter {

  public text: string;
  public userId: string | null;
  public order: DictionaryOrder;

  public constructor(text: string, userId: string | null, order: DictionaryOrder) {
    super();
    this.text = text;
    this.userId = userId;
    this.order = order;
  }

  public createQuery(): QueryLike<Array<Dictionary>, Dictionary> {
    const sortKey = DictionaryParameter.createSortKey(this.order);
    const nameFilter = (() => {
      const needle = new RegExp(escapeRegexp(this.text));
      const filter = DictionaryModel.find().where("name", needle).getFilter();
      return filter;
    })();
    const userFilter = (() => {
      if (this.userId !== null) {
        const filter = DictionaryModel.find().where("user", this.userId).getFilter();
        return filter;
      } else {
        return {};
      }
    })();
    const query = DictionaryModel.findExist().and([nameFilter, userFilter]).sort(sortKey);
    return query;
  }

}