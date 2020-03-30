//


export class CastUtil {

  // 型情報として数値であると思われている値を数値に変換して返します。
  // ただし、null もしくは undefined が渡された場合は、それをそのまま返します。
  // 何の意味もない関数に見えますが、型情報上は数値であっても、実際には数値以外が渡される可能性があるときに、数値であることを保証するために利用できます。
  public static ensureNumber<T extends Nullable<number>>(value: T): T {
    if (value === null) {
      return null as any;
    } else if (value === undefined) {
      return undefined as any;
    } else if (typeof value === "number") {
      return value;
    } else {
      return Number(value) as any;
    }
  }

  public static ensureBoolean<T extends Nullable<boolean>>(value: T): T {
    if (value === null) {
      return null as any;
    } else if (value === undefined) {
      return undefined as any;
    } else if (typeof value === "boolean") {
      return value;
    } else {
      return Boolean(value) as any;
    }
  }

  public static ensureString<T extends Nullable<string>>(value: T): T {
    if (value === null) {
      return null as any;
    } else if (value === undefined) {
      return undefined as any;
    } else if (typeof value === "string") {
      return value;
    } else {
      return String(value) as any;
    }
  }

  // 引数に渡された値を数値に変換して返します。
  // ただし、null もしくは undefined が渡された場合は、それをそのまま返します。
  public static castNumber<T>(value: T): Convert<T, number> {
    if (value === null) {
      return null as any;
    } else if (value === undefined) {
      return undefined as any;
    } else {
      return Number(value);
    }
  }

  public static castBoolean<T>(value: T): Convert<T, boolean> {
    if (value === null) {
      return null as any;
    } else if (value === undefined) {
      return undefined as any;
    } else {
      return Boolean(value);
    }
  }

  public static castString<T>(value: T): Convert<T, string> {
    if (value === null) {
      return null as any;
    } else if (value === undefined) {
      return undefined as any;
    } else {
      return String(value);
    }
  }

}


type Nullable<T> = T | null | undefined;
type Convert<T, S> = Extract<null | undefined, T> | S;