//

import {Dictionary, DictionaryModel} from "/server/model/dictionary/dictionary";
import {DictionaryOrder, DictionaryParameter} from "/server/model/dictionary-parameter/dictionary-parameter";
import {UserModel} from "/server/model/user/user";
import {escapeRegexp} from "/server/util/misc";
import {QueryLike} from "/server/util/query";


export class NormalDictionaryParameter extends DictionaryParameter {

  public text: string;
  public userName: string | null;
  public order: DictionaryOrder;

  public constructor(text: string, userName: string | null, order: DictionaryOrder) {
    super();
    this.text = text;
    this.userName = userName;
    this.order = order;
  }

  public createQuery(): QueryLike<Array<Dictionary>, Dictionary> {
    const needle = new RegExp(escapeRegexp(this.text));
    const sortKey = DictionaryParameter.createSortKey(this.order);
    if (this.userName !== null) {
      const promise = (async () => {
        const user = await UserModel.findOne().where("name", this.userName);
        if (user !== null) {
          const dictionaries = await DictionaryModel.findExist().ne("secret", true).where("name", needle).where("user", user).sort(sortKey);
          return dictionaries;
        } else {
          return [];
        }
      })();
      return promise;
    } else {
      const query = DictionaryModel.findExist().ne("secret", true).where("name", needle).sort(sortKey);
      return query;
    }
  }

}