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
  public restrict<T>(query: Array<T>): Array<T>;
  public restrict<T, D>(query: QueryLike<Array<T>, D>): QueryLike<Array<T>, D>;
  public restrict<T, D>(query: QueryLike<Array<T>, D>): QueryLike<Array<T>, D> {
    if (Array.isArray(query)) {
      const start = this.offset ?? 0;
      const end = (this.size !== undefined) ? start + this.size : undefined;
      const result = query.slice(start, end);
      return result;
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

  public restrictArray<T>(query: Array<T>): Array<T> {
    const start = this.offset ?? 0;
    const end = (this.size !== undefined) ? start + this.size : undefined;
    const result = query.slice(start, end);
    return result;
  }

  public static restrict<T, D>(query: Query<Array<T>, D>, range?: QueryRange): Query<Array<T>, D>;
  public static restrict<T>(query: Aggregate<Array<T>>, range?: QueryRange): Aggregate<Array<T>>;
  public static restrict<T>(query: Array<T>, range?: QueryRange): Array<T>;
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

  public static restrictWithSize<T, D>(query: QueryLike<Array<T>, D>, range?: QueryRange): PromiseLike<WithSize<T>> {
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
    if (Array.isArray(query)) {
      const size = query.length;
      return Promise.resolve(size);
    } else {
      const model = QueryRange.getModel(query);
      if (query instanceof Query) {
        const promise = model.countDocuments(query.getFilter());
        return promise;
      } else if (query instanceof Aggregate) {
        const rawPromise = model.aggregate(query.pipeline()).count("count").exec() as Promise<any>;
        const promise = rawPromise.then((object) => object.count);
        return promise;
      } else {
        throw new Error("cannot happen");
      }
    }
  }

  private static countArray<T>(query: Array<T>): number {
    const size = query.length;
    return size;
  }

  private static getModel<T, D>(query: Query<Array<T>, D> | Aggregate<Array<T>>): Model<any> {
    const anyQuery = query as any;
    if (query instanceof Query) {
      return anyQuery.model;
    } else if (query instanceof Aggregate) {
      return anyQuery.model();
    } else {
      throw new Error("cannot happen");
    }
  }

}


export type QueryLike<T, D = any> = Query<T, D> | Aggregate<T> | T;