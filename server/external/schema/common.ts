//

import {number, object} from "yup";


export const RANGE = object({
  skip: number().min(0),
  limit: number().min(1).max(100).default(100)
});

export type WithTotal<T> = {results: Array<T>, total: number};