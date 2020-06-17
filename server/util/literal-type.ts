//


export class LiteralUtilType<T extends string> {

  private values: Array<T>;
  public defaultValue: T;

  private constructor(values: Array<T>, defaultValue: T) {
    this.values = values;
    this.defaultValue = defaultValue;
  }

  public is(value: string | null | undefined): value is T {
    if (typeof value === "string") {
      let castValue = value as T;
      let index = this.values.indexOf(castValue);
      return index >= 0;
    } else {
      return false;
    }
  }

  public cast(value: string | number | null | undefined): T {
    if (typeof value === "string") {
      let castValue = value as T;
      let index = this.values.indexOf(castValue);
      if (index >= 0) {
        return this.values[index];
      } else {
        return this.defaultValue;
      }
    } else if (typeof value === "number") {
      if (value >= 0 && value < this.values.length) {
        return this.values[value];
      } else {
        return this.defaultValue;
      }
    } else {
      return this.defaultValue;
    }
  }

  public indexOf(value: string): number {
    let anyValue = value as any;
    let index = this.values.indexOf(anyValue);
    return index;
  }

  public static create<T extends string>(values: {0: T} & ArrayLike<T>): LiteralUtilType<T> {
    let castValues = Array.from(values);
    let defaultValue = values[0];
    let result = new LiteralUtilType(castValues, defaultValue);
    return result;
  }

}


export type LiteralType<T> = T extends {[key: number]: infer U} ? U : never;