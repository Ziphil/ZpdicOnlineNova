//

import {
  Plain
} from "/server/controller/internal/type";


export class Skeleton {

  // このコンストラクタは型安全ではないので使用せず、代わりに of メソッドを使用してください。
  // of メソッドの型定義のために、このコンストラクタは public になっています。
  public constructor(object: object) {
    Object.assign(this, object);
  }

  public static of<S extends object>(this: new(object: object) => S, object: Plain<S>): S {
    return new this(object);
  }

}