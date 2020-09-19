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

  public restrict<T, Q extends Query<T>>(query: Q): Q;
  public restrict<T>(query: Array<T>): Array<T>;
  public restrict<T, Q extends Query<T>>(query: Q | Array<T>): Q | Array<T> {
    if (Array.isArray(query)) {
      let start = this.offset ?? 0;
      let end = (this.size !== undefined) ? start + this.size : undefined;
      return query.slice(start, end);
    } else {
      if (this.offset !== undefined) {
        query = query.skip(this.offset);
      }
      if (this.size !== undefined) {
        query = query.limit(this.size);
      }
      return query;
    }
  }

  public static restrict<T, Q extends Query<T>>(query: Q, range?: QueryRange): Q;
  public static restrict<T>(query: Array<T>, range?: QueryRange): Array<T>;
  public static restrict<T, Q extends Query<T>>(query: Q | Array<T>, range?: QueryRange): Q | Array<T> {
    if (range !== undefined) {
      if (Array.isArray(query)) {
        return range.restrict(query);
      } else {
        return range.restrict(query);
      }
    } else {
      return query;
    }
  }

}