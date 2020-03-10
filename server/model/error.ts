//

import {
  Error as MongooseError
} from "mongoose";


export class CustomError<E extends string> extends MongooseError {

  public name: "CustomError" = "CustomError";
  public type: E;

  public constructor(type: E, message: string = "") {
    super(message);
    this.type = type;
  }

}


export class CustomErrorSkeleton<E extends string> {

  public error: "error";
  public type: E;
  public code?: number;

  public constructor(type: E, code?: number) {
    this.error = "error";
    this.type = type;
    this.code = code;
  }

}