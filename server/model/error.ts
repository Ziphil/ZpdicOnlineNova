/* eslint-disable @typescript-eslint/prefer-as-const */

import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export class CustomError<E extends string> extends Error {

  public name: "CustomError" = "CustomError";
  public type: E;

  public constructor(type: E, message: string = "") {
    super(message);
    this.type = type;
  }

  public static isCustomError<E extends string>(error: unknown, type?: E): error is CustomError<E> {
    return error instanceof Error && error.name === "CustomError" && (type === undefined || (error as any).type === type);
  }

}


export const LIMIT_ERROR_TYPES = [
  "dictionaryCountExceeded",
  "wordCountExceeded",
  "wordSizeExceeded",
  "invalidWord",
  "exampleCountExceeded",
  "exampleSizeExceeded",
  "invalidExample",
  "articleCountExceeded",
  "articleSizeExceeded",
  "invalidArticle",
  "invalidProposal"
] as const;
export type LimitErrorType = LiteralType<typeof LIMIT_ERROR_TYPES>;
export const LimitErrorTypeUtil = LiteralUtilType.create(LIMIT_ERROR_TYPES);
