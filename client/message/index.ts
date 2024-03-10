/* eslint-disable no-useless-computed-key */

import {MessageInventory, convertInterslavicCyrillicToLatin, convertMessages} from "zographia";


export const messageInventory = {
  ["ja"]: () => import("./ja.yml"),
  ["en"]: () => import("./en.yml"),
  ["eo"]: () => import("./eo.yml"),
  ["isv-Cyrl"]: () => import("./isv.yml"),
  ["isv-Latn"]: () => import("./isv.yml").then((messages) => convertMessages(messages.default, convertInterslavicCyrillicToLatin))
} as any as MessageInventory;