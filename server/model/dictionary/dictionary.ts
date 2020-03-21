//

import {
  DocumentType
} from "@hasezoey/typegoose";
import {
  DocumentQuery
} from "mongoose";
import {
  NormalSearchParameter
} from "/server/model/dictionary/search-parameter";


export abstract class Dictionary<W> {

  protected abstract createQuery(parameter: NormalSearchParameter): DocumentQuery<Array<DocumentType<W>>, DocumentType<W>>;

  public async search(parameter: NormalSearchParameter, offset?: number, size?: number): Promise<Array<DocumentType<W>>> {
    let query = this.createQuery(parameter);
    if (offset !== undefined) {
      query = query.skip(offset);
    }
    if (size !== undefined) {
      query = query.limit(size);
    }
    let words = await query.exec();
    return words;
  }

}