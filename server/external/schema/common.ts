//

import {number, object} from "yup";


export const RANGE = object({
  skip: number().min(0),
  limit: number().min(1).max(100).default(100)
});

export type WithTotal<T, N extends string> = {[key in N]: Array<T>} & {total: number};