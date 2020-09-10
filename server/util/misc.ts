//

import {
  randomBytes
} from "crypto";


export function createRandomString(length: number, addDate?: boolean): string {
  let string = randomBytes(length).toString("base64").substring(0, length).replace(/\+/g, "-").replace(/\//g, "_");
  if (addDate) {
    let date = new Date();
    string += date.getTime();
  }
  return string;
}