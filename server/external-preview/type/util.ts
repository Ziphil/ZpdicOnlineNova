/* eslint-disable @typescript-eslint/naming-convention */

import {mixed} from "yup";


export const defaultRequest = {
  query: mixed<never>(),
  body: mixed<never>()
} as const;

export const defaultResponse = {
  200: mixed<never>(),
  201: mixed<never>(),
  400: mixed<{error: string}>(),
  401: mixed<{error: string}>(),
  403: mixed<{error: string}>(),
  404: mixed<{error: string}>(),
  409: mixed<{error: string}>(),
  429: mixed<{error: string}>()
} as const;