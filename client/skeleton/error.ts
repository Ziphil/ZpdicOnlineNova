//


export class CustomError<E extends string = string> {

  public error!: "CustomError";
  public type!: E;
  public code?: number;

  public static ofType<E extends string>(type: E, code?: number): CustomError<E> {
    const error = "CustomError" as const;
    const skeleton = {error, type, code};
    return skeleton;
  }

}