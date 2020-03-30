//

import {
  Document,
  DocumentQuery
} from "mongoose";


export class QueryUtil {

  public static restrict<T, D extends Document, H>(query: DocumentQuery<T, D, H>, offset?: number, size?: number): DocumentQuery<T, D, H> {
    if (offset !== undefined) {
      query = query.skip(offset);
    }
    if (size !== undefined) {
      query = query.limit(size);
    }
    return query;
  }

}