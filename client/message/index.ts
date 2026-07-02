/* eslint-disable no-useless-computed-key */

import {MessageInventory} from "zographia";


export const messageInventory = {
  ["ja"]: () => import("./ja.yml"),
  ["en"]: () => import("./en.yml"),
  ["eo"]: () => import("./eo.yml")
} as any as MessageInventory;