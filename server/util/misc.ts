//

import {
  randomBytes
} from "crypto";
import removeMarkdownOriginal from "remove-markdown";


// 与えられた長さのランダムな URL-safe Base64 文字列を生成します。
// addDate として true を渡すと、生成した文字列の後に 13 文字の日付データが追加されます。
export function createRandomString(length: number, addDate?: boolean): string {
  let string = randomBytes(length).toString("base64").substring(0, length).replace(/\+/g, "-").replace(/\//g, "_");
  if (addDate) {
    let date = new Date();
    string += date.getTime();
  }
  return string;
}

export function removeMarkdown(source: string): string {
  let options = {gfm: true};
  let result = removeMarkdownOriginal(source, options);
  return result;
}

export function escapeRegexp(string: string): string {
  let escapedString = string.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
  return escapedString;
}

export function sanitizeFileName(string: string): string {
  let sanitizedString = string.replace(/[\\\/:\*\?\"\<\>\|]/g, "");
  return sanitizedString;
}