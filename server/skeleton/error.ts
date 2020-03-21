//


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