//

import {
  DocumentType,
  prop
} from "@typegoose/typegoose";
import {
  HydratedDocument,
  Model,
  QueryWithHelpers
} from "mongoose";


export class DiscardableSchema {

  @prop()
  public removedDate?: Date;

  public static findExist<T, H>(this: Model<T, H>, callback?: (error: any, result: Array<T>) => void): QueryWithHelpers<Array<HydratedDocument<T>>, HydratedDocument<T>, H, T> {
    return this.find({}, callback).where({removedDate: undefined});
  }

  public static findOneExist<T, H>(this: Model<T, H>, callback?: (error: any, result: T | null) => void): QueryWithHelpers<HydratedDocument<T> | null, HydratedDocument<T>, H, T> {
    return this.findOne({}, callback).where({removedDate: undefined});
  }

  public static updateManyDiscarded<T extends DocumentType<DiscardableSchema>, H>(this: Model<T, H>): QueryWithHelpers<any, HydratedDocument<T>, H, T> {
    let removedDate = new Date();
    return this.updateMany({}, {removedDate});
  }

  public static updateOneDiscarded<T extends DocumentType<DiscardableSchema>, H>(this: Model<T, H>): QueryWithHelpers<any, HydratedDocument<T>, H, T> {
    let removedDate = new Date();
    return this.updateOne({}, {removedDate});
  }

  public flagDiscarded<T extends DocumentType<DiscardableSchema>>(this: T): Promise<this> {
    let removedDate = new Date();
    return this.update({removedDate}).exec();
  }

}