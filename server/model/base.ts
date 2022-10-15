//

import {
  DocumentType,
  prop
} from "@typegoose/typegoose";
import {
  DeleteResult
} from "mongodb";
import {
  CallbackError,
  HydratedDocument,
  Model,
  QueryWithHelpers
} from "mongoose";


export class DiscardableSchema {

  @prop()
  public removedDate?: Date;

  public static findExist<T, H>(this: Model<T, H>, callback?: (error: CallbackError, result: Array<T>) => void): QueryWithHelpers<Array<T>, T, H, T> {
    return this.find({}, callback).where({removedDate: undefined});
  }

  public static findOneExist<T, H>(this: Model<T, H>, callback?: (error: CallbackError, result: T | null) => void): QueryWithHelpers<HydratedDocument<T> | null, HydratedDocument<T>, H, T> {
    return this.findOne({}, callback).where({removedDate: undefined});
  }

  public static deleteManyExist<T, H>(this: Model<T, H>, callback?: (error: CallbackError) => void): QueryWithHelpers<DeleteResult, HydratedDocument<T>, H, T> {
    return this.deleteMany({}, callback).where({removedDate: undefined});
  }

  public static deleteOneExist<T, H>(this: Model<T, H>, callback?: (error: CallbackError) => void): QueryWithHelpers<DeleteResult, HydratedDocument<T>, H, T> {
    return this.deleteOne({}, callback).where({removedDate: undefined});
  }

  public static updateManyDiscarded<T extends DocumentType<DiscardableSchema>, H>(this: Model<T, H>): QueryWithHelpers<any, HydratedDocument<T>, H, T> {
    const removedDate = new Date();
    return this.updateMany({}, {removedDate});
  }

  public static updateOneDiscarded<T extends DocumentType<DiscardableSchema>, H>(this: Model<T, H>): QueryWithHelpers<any, HydratedDocument<T>, H, T> {
    const removedDate = new Date();
    return this.updateOne({}, {removedDate});
  }

  public flagDiscarded<T extends DocumentType<DiscardableSchema>>(this: T): Promise<this> {
    const removedDate = new Date();
    return this.update({removedDate}).exec();
  }

}