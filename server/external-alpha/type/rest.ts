/* eslint-disable @typescript-eslint/naming-convention */

import {InferType, mixed, object} from "yup";
import {
  EditableWord$In,
  NormalWordParameter$In,
  Range,
  WithTotal,
  Word$Out,
  WordWithExamples$Out
} from "/server/external-alpha/schema";
import {defaultRequest, defaultResponse} from "/server/external-alpha/type/util";


export const SERVER_PATH_PREFIX = "/api/v1";

export const SERVER_SCHEMATA = {
  searchWords: {
    request: {
      ...defaultRequest,
      query: NormalWordParameter$In.concat(Range)
    },
    response: {
      ...defaultResponse,
      200: mixed<WithTotal<WordWithExamples$Out, "words">>()
    }
  },
  fetchWord: {
    request: {
      ...defaultRequest,
      query: mixed<never>()
    },
    response: {
      ...defaultResponse,
      200: mixed<{word: Word$Out}>()
    }
  },
  addWord: {
    request: {
      ...defaultRequest,
      body: object({
        word: EditableWord$In.required()
      })
    },
    response: {
      ...defaultResponse,
      201: mixed<{word: Word$Out}>()
    }
  },
  editWord: {
    request: {
      ...defaultRequest,
      body: object({
        word: EditableWord$In.required()
      })
    },
    response: {
      ...defaultResponse,
      200: mixed<{word: Word$Out}>()
    }
  },
  discardWord: {
    request: {
      ...defaultRequest,
      body: mixed<never>()
    },
    response: {
      ...defaultResponse,
      200: mixed<{word: Word$Out}>()
    }
  }
} as const;

export type RequestType = "query" | "body";
export type ResponseCode = keyof typeof defaultResponse;
export type ProcessName = keyof ServerSpecs;

type ServerSpecs = typeof SERVER_SCHEMATA;

export type RequestData<N extends ProcessName, T extends RequestType> = InferType<ServerSpecs[N]["request"][T]>;
export type ResponseData<N extends ProcessName, T extends ResponseCode> = InferType<ServerSpecs[N]["response"][T]>;