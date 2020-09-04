//

import {
  Document,
  DocumentQuery
} from "mongoose";


export class QueryRange {

  public offset?: number;
  public size?: number;

  public constructor(offset?: number, size?: number) {
    this.offset = offset;
    this.size = size;
  }

  public restrict<T, D extends Document, H>(query: DocumentQuery<T, D, H>): DocumentQuery<T, D, H> {
    if (this.offset !== undefined) {
      query = query.skip(this.offset);
    }
    if (this.size !== undefined) {
      query = query.limit(this.size);
    }
    return query;
  }

  public static restrict<T, D extends Document, H>(query: DocumentQuery<T, D, H>, range?: QueryRange): DocumentQuery<T, D, H> {
    if (range !== undefined) {
      return range.restrict(query);
    } else {
      return query;
    }
  }

}