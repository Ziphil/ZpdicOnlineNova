//

import {
  Error as MongooseError
} from "mongoose";


export class CustomError extends MongooseError {

  public name: "CustomError" = "CustomError";
  public type: string;

  public constructor(type: string, message: string = "") {
    super(message);
    this.type = type;
  }

}