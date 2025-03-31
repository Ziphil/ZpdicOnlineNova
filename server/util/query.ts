//

import {Aggregate, Query} from "mongoose";
import {cloneQuery, getModelOfQuery} from "/server/util/mongo";


export class QueryRange {

  public offset?: number;
  public size?: number;

  public constructor(offset?: number, size?: number) {
    this.offset = offset;
    this.size = size;
  }

  public restrict<T, D>(query: Query<Array<T>, D>): Query<Array<T>, D>;
  public restrict<T>(query: Aggregate<Array<T>>): Aggregate<Array<T>>;
  public restrict<T>(query: Promise<Array<T>>): Promise<Array<T>>;
  public restrict<T, D>(query: QueryLike<Array<T>, D>): QueryLike<Array<T>, D>;
  public restrict<T, D>(query: QueryLike<Array<T>, D>): QueryLike<Array<T>, D> {
    if ("skip" in query && "limit" in query) {
      let clonedQuery = cloneQuery(query);
      if (this.offset !== undefined) {
        clonedQuery = clonedQuery.skip(this.offset);
      }
      if (this.size !== undefined) {
        clonedQuery = clonedQuery.limit(this.size);
      }
      return clonedQuery;
    } else {
      const promise = query.then((array) => {
        const start = this.offset ?? 0;
        const end = (this.size !== undefined) ? start + this.size : undefined;
        const restrictedArray = array.slice(start, end);
        return restrictedArray;
      });
      return promise;
    }
  }

  public restrictArray<T>(query: Array<T>): Array<T> {
    const start = this.offset ?? 0;
    const end = (this.size !== undefined) ? start + this.size : undefined;
    const result = query.slice(start, end);
    return result;
  }

  public static restrict<T, D>(query: Query<Array<T>, D>, range?: QueryRange): Query<Array<T>, D>;
  public static restrict<T>(query: Aggregate<Array<T>>, range?: QueryRange): Aggregate<Array<T>>;
  public static restrict<T>(query: Promise<Array<T>>, range?: QueryRange): Promise<Array<T>>;
  public static restrict<T, D>(query: QueryLike<Array<T>, D>, range?: QueryRange): QueryLike<Array<T>, D>;
  public static restrict<T, D>(query: QueryLike<Array<T>, D>, range?: QueryRange): QueryLike<Array<T>, D> {
    if (range !== undefined) {
      return range.restrict(query);
    } else {
      return query;
    }
  }

  public static restrictArray<T>(query: Array<T>, range?: QueryRange): Array<T> {
    if (range !== undefined) {
      return range.restrictArray(query);
    } else {
      return query;
    }
  }

  public static restrictWithSize<T, D>(query: QueryLike<Array<T>, D>, range?: QueryRange): Promise<WithSize<T>> {
    const restrictedQuery = QueryRange.restrict(query, range);
    const sizeQuery = QueryRange.count(query);
    const promise = Promise.all([restrictedQuery, sizeQuery]);
    return promise;
  }

  public static restrictArrayWithSize<T>(query: Array<T>, range?: QueryRange): WithSize<T> {
    const restrictedQuery = QueryRange.restrictArray(query, range);
    const sizeQuery = QueryRange.countArray(query);
    const result = [restrictedQuery, sizeQuery] as WithSize<T>;
    return result;
  }

  private static count<T, D>(query: QueryLike<Array<T>, D>): PromiseLike<number> {
    if ("skip" in query && "limit" in query) {
      const model = getModelOfQuery(query);
      if (query instanceof Query) {
        const promise = model.countDocuments(query.getFilter()) ?? 0;
        return promise;
      } else if (query instanceof Aggregate) {
        const promise = model.aggregate(query.pipeline()).count("count").then((object) => object[0]?.count ?? 0);
        return promise;
      } else {
        throw new Error("cannot happen");
      }
    } else {
      const promise = query.then((array) => array.length);
      return promise;
    }
  }

  private static countArray<T>(query: Array<T>): number {
    const size = query.length;
    return size;
  }

}


export type QueryLike<T, D = any> = Query<T, D> | Aggregate<T> | Promise<T>;

export type WithSize<T> = readonly [Array<T>, number];