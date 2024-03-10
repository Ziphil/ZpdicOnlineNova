/* eslint-disable @typescript-eslint/no-namespace */


export interface CustomError<E extends string = string> {

  error: "CustomError";
  type: E;
  code?: number;

}


export namespace CustomError {

  export function ofType<E extends string>(type: E, code?: number): CustomError<E> {
    const error = "CustomError" as const;
    const skeleton = {error, type, code};
    return skeleton;
  }

}