//

import * as mongoose from "mongoose";
import {
  Document,
  Schema
} from "mongoose";


export interface UserDocument extends Document {

  name: string;
  password: string;
  email: string;

}


let schema = new Schema({
  name: {type: String, required: true},
  password: {type: String, require: true},
  email: {type: String, required: true}
});
export let User = mongoose.model<UserDocument>("User", schema);