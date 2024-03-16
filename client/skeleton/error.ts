/* eslint-disable @typescript-eslint/no-namespace */


export interface CustomError<E extends string = string> {

  error: "CustomError";
  type: E;
  code?: number;

}


export type CustomErrorType<T> = T extends CustomError<infer E> ? E : never;