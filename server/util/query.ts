//

import {
  Document,
  Query
} from "mongoose";


export class QueryRange {

  public offset?: number;
  public size?: number;

  public constructor(offset?: number, size?: number) {
    this.offset = offset;
    this.size = size;
  }

  public restrict<T, Q extends Query<T>>(query: Q): Q {
    if (this.offset !== undefined) {
      query = query.skip(this.offset);
    }
    if (this.size !== undefined) {
      query = query.limit(this.size);
    }
    return query;
  }

  public static restrict<T, Q extends Query<T>>(query: Q, range?: QueryRange): Q {
    if (range !== undefined) {
      return range.restrict(query);
    } else {
      return query;
    }
  }

}