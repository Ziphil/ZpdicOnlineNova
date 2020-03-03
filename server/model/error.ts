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


export class CustomErrorSkeleton {

  public error: "error";
  public type: string;
  public code?: number;

  public constructor(type: string, code?: number) {
    this.error = "error";
    this.type = type;
    this.code = code;
  }

}


export type MayError<T> = T | CustomErrorSkeleton;