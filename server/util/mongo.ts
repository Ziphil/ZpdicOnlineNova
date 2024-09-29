//

import {Aggregate, Model, Query, SchemaTypes, mongo} from "mongoose";


export function toObjectId(value: string): any {
  const ObjectId = mongo["ObjectId"];
  return new ObjectId(value);
}

export function getModelOfQuery<R, D>(query: Query<R, D>): Model<any>;
export function getModelOfQuery<R>(query: Aggregate<Array<R>>): Model<any>;
export function getModelOfQuery<R, S, D>(query: Query<R, D> | Aggregate<Array<S>>): Model<any>;
export function getModelOfQuery<R, S, D>(query: Query<R, D> | Aggregate<Array<S>>): Model<any> {
  if (query instanceof Query) {
    return query.model;
  } else {
    const anyQuery = query as any;
    return anyQuery.model();
  }
}

export function cloneQuery<R, D>(query: Query<R, D>): Query<R, D>;
export function cloneQuery<R>(query: Aggregate<Array<R>>): Aggregate<Array<R>>;
export function cloneQuery<R, S, D>(query: Query<R, D> | Aggregate<Array<S>>): Query<R, D> | Aggregate<Array<S>>;
export function cloneQuery<R, S, D>(query: Query<R, D> | Aggregate<Array<S>>): Query<R, D> | Aggregate<Array<S>> {
  if (query instanceof Query) {
    return query.clone();
  } else {
    const model = getModelOfQuery(query);
    const clonedQuery = model.aggregate(query.pipeline());
    return clonedQuery;
  }
}

export function setMongoCheckRequired(name: keyof typeof SchemaTypes): void {
  const SchemaType = SchemaTypes[name] as any as SchemaTypeStatic;
  SchemaType.checkRequired((value) => value !== null);
}

type SchemaTypeStatic = {checkRequired: (check: (value: any) => boolean) => void};