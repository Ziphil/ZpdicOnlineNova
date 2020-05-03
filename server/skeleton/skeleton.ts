//


export class Skeleton {

  // このコンストラクタは型安全ではないので使用せず、代わりに of メソッドを使用してください。
  // of メソッドの型定義のために、このコンストラクタは public になっています。
  public constructor(object: object) {
    Object.assign(this, object);
  }

  public static of<S extends Skeleton>(this: new(object: object) => S, object: Plain<S>): S {
    return new this(object);
  }

  public copy(): this {
    let skeleton = {} as any;
    for (let [key, value] of Object.entries(this)) {
      if (value instanceof Skeleton) {
        skeleton[key] = value.copy();
      } else {
        skeleton[key] = value;
      }
    }
    return skeleton;
  }

}


type ExtractRequired<T, P extends keyof T> = undefined extends T[P] ? never : P;
type ExtractOptional<T, P extends keyof T> = undefined extends T[P] ? P : never;
type RequiredProperties<T> = {[P in keyof T]: T[P] extends (...args: Array<any>) => any ? never : ExtractRequired<T, P>}[keyof T];
type OptionalProperties<T> = {[P in keyof T]: T[P] extends (...args: Array<any>) => any ? never : ExtractOptional<T, P>}[keyof T];

type Plain<T> = {[P in RequiredProperties<T>]: T[P]} & {[P in OptionalProperties<T>]?: T[P]};