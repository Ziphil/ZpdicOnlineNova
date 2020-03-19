//


export abstract class LiteralUtilType<T extends string> {

  public abstract is(value: string): value is T;

  public abstract cast(value: string): T;

  public static create<T extends string>(values: {0: T, [key: number]: T}): LiteralUtilType<T> {
    let anyValues = values as any;
    let is = function (value: string): value is T {
      return anyValues.indexOf(value) >= 0;
    };
    let cast = function (value: string): T {
      return (is(value)) ? value : values[0];
    };
    let result = {is, cast};
    return result;
  }

}


export type LiteralType<T> = T extends {[key: number]: infer U} ? U : never;