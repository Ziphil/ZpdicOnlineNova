//

import {InferType, mixed, number, object, string} from "yup";
import {NormalWordParameter} from "/server/external/schema";


export const SERVER_PATH_PREFIX = "/api";

export const SERVER_SCHEMATA = {
  debug: {
    request: object({
      identifier: string().required(),
      skip: number().min(0),
      limit: number().min(1).max(100).default(100)
    }).concat(NormalWordParameter),
    response: {
      success: mixed(),
      error: string()
    }
  }
} as const;

export type Status = "success" | "error";
export type ProcessName = keyof ServerSpecs;

type ServerSpecs = typeof SERVER_SCHEMATA;

export type RequestData<N extends ProcessName> = InferType<ServerSpecs[N]["request"]>;
export type ResponseData<N extends ProcessName> = SuccessResponseData<N> | ErrorResponseData<N>;
export type SuccessResponseData<N extends ProcessName> = InferType<ServerSpecs[N]["response"]["success"]>;
export type ErrorResponseData<N extends ProcessName> = InferType<ServerSpecs[N]["response"]["error"]>;
