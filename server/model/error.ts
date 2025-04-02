/* eslint-disable @typescript-eslint/prefer-as-const */


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