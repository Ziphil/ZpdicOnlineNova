//

import {
  Aggregate,
  Model,
  Query
} from "mongoose";
import {
  WithSize
} from "/server/controller/internal/type";


export class QueryRange {

  public offset?: number;
  public size?: number;

  public constructor(offset?: number, size?: number) {
    this.offset = offset;
    this.size = size;
  }

  public restrict<T, D>(query: Query<Array<T>, D>): Query<Array<T>, D>;
  public restrict<T>(query: Aggregate<Array<T>>): Aggregate<Array<T>>;
  public restrict<T>(query: QueryLike<Array<T>>): QueryLike<Array<T>>;
  public restrict<T>(query: QueryLike<Array<T>>): QueryLike<Array<T>> {
    if (this.offset !== undefined) {
      query = query.skip(this.offset);
    }
    if (this.size !== undefined) {
      query = query.limit(this.size);
    }
    return query;
  }

  public restrictArray<T>(query: Array<T>): Array<T> {
    let start = this.offset ?? 0;
    let end = (this.size !== undefined) ? start + this.size : undefined;
    let result = query.slice(start, end);
    return result;
  }

  public static restrict<T, D>(query: Query<Array<T>, D>, range?: QueryRange): Query<Array<T>, D>;
  public static restrict<T>(query: Aggregate<Array<T>>, range?: QueryRange): Aggregate<Array<T>>;
  public static restrict<T>(query: QueryLike<Array<T>>, range?: QueryRange): QueryLike<Array<T>>;
  public static restrict<T>(query: QueryLike<Array<T>>, range?: QueryRange): QueryLike<Array<T>> {
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

  public static restrictWithSize<T>(query: QueryLike<Array<T>>, range?: QueryRange): PromiseLike<WithSize<T>> {
    let restrictedQuery = QueryRange.restrict(query, range);
    let sizeQuery = QueryRange.count(query);
    let promise = Promise.all([restrictedQuery, sizeQuery]);
    return promise;
  }

  public static restrictArrayWithSize<T>(query: Array<T>, range?: QueryRange): WithSize<T> {
    let restrictedQuery = QueryRange.restrictArray(query, range);
    let sizeQuery = QueryRange.countArray(query);
    let result = [restrictedQuery, sizeQuery] as WithSize<T>;
    return result;
  }

  private static count<T>(query: QueryLike<Array<T>>): PromiseLike<number> {
    let model = QueryRange.getModel(query);
    if (query instanceof Query) {
      let promise = model.countDocuments(query.getFilter());
      return promise;
    } else if (query instanceof Aggregate) {
      let rawPromise = model.aggregate(query.pipeline()).count("count").exec() as Promise<any>;
      let promise = rawPromise.then((object) => object.count);
      return promise;
    } else {
      throw new Error("cannot happen");
    }
  }

  private static countArray<T>(query: Array<T>): number {
    let size = query.length;
    return size;
  }

  private static getModel<T>(query: QueryLike<Array<T>>): Model<any> {
    let anyQuery = query as any;
    if (query instanceof Query) {
      return anyQuery.model;
    } else if (query instanceof Aggregate) {
      return anyQuery.model();
    } else {
      throw new Error("cannot happen");
    }
  }

}


type QueryLike<T> = Query<T, any> | Aggregate<T>;