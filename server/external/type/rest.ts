//

import {InferType, mixed, object} from "yup";
import {EDITABLE_WORD, NORMAL_WORD_PARAMETER, RANGE, WithTotal, Word, WordWithExamples} from "/server/external/schema";


export const SERVER_PATH_PREFIX = "/api";

export const SERVER_SCHEMATA = {
  searchWords: {
    request: NORMAL_WORD_PARAMETER.concat(RANGE),
    response: {
      success: mixed<WithTotal<WordWithExamples, "words">>(),
      error: mixed()
    }
  },
  addWord: {
    request: object({
      word: EDITABLE_WORD
    }),
    response: {
      success: mixed<{word: Word}>(),
      error: mixed()
    }
  },
  editWord: {
    request: object({
      word: EDITABLE_WORD
    }),
    response: {
      success: mixed<{word: Word}>(),
      error: mixed()
    }
  },
  discardWord: {
    request: mixed<never>(),
    response: {
      success: mixed<{word: Word}>(),
      error: mixed()
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
