//


export const IDENTIFIER_REGEXP = /^(?=.{1,30}$)[a-zA-Z0-9_-]*[a-zA-Z_-]+[a-zA-Z0-9_-]*$/;
export const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function validatePassword(password: string): boolean {
  const length = password.length;
  const predicate = length >= 6 && length <= 50;
  return predicate;
}

/** 配列の要素数が指定された数以下であるかどうかを判定する検証関数を作成します。
 * Mongoose のスキーマに配列の要素数の上限を設定する際に利用します。*/
export function createMaxCountValidator(maxCount: number): (values: Array<unknown> | null | undefined) => boolean {
  const validator = function (values: Array<unknown> | null | undefined): boolean {
    const predicate = values === null || values === undefined || values.length <= maxCount;
    return predicate;
  };
  return validator;
}

/** データを JSON 文字列に変換したときのバイト数を返します。
 * データベースに保存されるデータの大きさの目安として利用します。*/
export function calcDataSize(data: unknown): number {
  const size = Buffer.byteLength(JSON.stringify(data));
  return size;
}