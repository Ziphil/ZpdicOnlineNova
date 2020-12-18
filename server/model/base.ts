//

import {
  DocumentType,
  prop
} from "@typegoose/typegoose";
import {
  Model,
  Query
} from "mongoose";


export class RemovableSchema {

  @prop()
  public removedDate?: Date;

  public static findExist<S, H>(this: Model<DocumentType<S>, H>, callback?: (error: any, result: Array<DocumentType<S>>) => void): Query<Array<DocumentType<S>>> & H {
    return this.find({}, callback).where({removedDate: undefined});
  }

  public static findOneExist<S, H>(this: Model<DocumentType<S>, H>, callback?: (error: any, result: DocumentType<S> | null) => void): Query<DocumentType<S> | null> & H {
    return this.findOne({}, callback).where({removedDate: undefined});
  }

  public static updateManyDiscarded<H>(this: Model<DocumentType<RemovableSchema>, H>): Query<any> & H {
    let removedDate = new Date();
    return this.updateMany({}, {removedDate});
  }

  public static updateOneDiscarded<H>(this: Model<DocumentType<RemovableSchema>, H>): Query<any> & H {
    let removedDate = new Date();
    return this.updateOne({}, {removedDate});
  }

  public flagDiscarded(this: DocumentType<RemovableSchema>): Promise<this> {
    let removedDate = new Date();
    return this.update({removedDate}).exec();
  }

}