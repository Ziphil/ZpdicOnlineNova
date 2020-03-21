//


export class LiteralUtilType<T extends string> {

  public defaultValue: T;
  public is: (value: string) => value is T;

  private constructor(defaultValue: T, is: (value: string) => value is T) {
    this.defaultValue = defaultValue;
    this.is = is;
  }

  public cast(value: string): T {
    if (this.is(value)) {
      return value;
    } else {
      return this.defaultValue;
    }
  }

  public static create<T extends string>(values: {0: T} & ArrayLike<T>): LiteralUtilType<T> {
    let defaultValue = values[0];
    let is = function (value: string): value is T {
      let anyValues = values as any;
      return anyValues.indexOf(value) >= 0;
    };
    let result = new LiteralUtilType(defaultValue, is);
    return result;
  }

}


export type LiteralType<T> = T extends {[key: number]: infer U} ? U : never;