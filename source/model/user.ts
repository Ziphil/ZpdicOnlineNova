//

import {
  DocumentType,
  ReturnModelType,
  Typegoose,
  getModelForClass,
  prop,
} from "@hasezoey/typegoose";
import {
  Document,
  Schema
} from "mongoose";


export class User {

  @prop({required: true, unique: true})
  public name!: string;

  @prop({required: true})
  public password!: string;

  @prop({required: true})
  public email!: string;

  public static authenticate(this: ReturnModelType<typeof User>, name: string, password: string): Promise<DocumentType<User> | null> {
    return this.findOne({name, password}).exec();
  }

}


export let UserModel = getModelForClass(User);