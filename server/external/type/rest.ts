/* eslint-disable @typescript-eslint/naming-convention */

import {InferType, mixed, object} from "yup";
import {
  EDITABLE_EXAMPLE,
  EDITABLE_WORD,
  Example,
  ExampleOffer,
  NORMAL_EXAMPLE_OFFER_PARAMETER,
  NORMAL_WORD_PARAMETER,
  RANGE,
  WithTotal,
  Word,
  WordWithExamples
} from "/server/external/schema";
import {defaultRequest, defaultResponse} from "/server/external/type/util";


export const SERVER_PATH_PREFIX = "/api";

export const SERVER_SCHEMATA = {
  searchWords: {
    request: {
      ...defaultRequest,
      query: NORMAL_WORD_PARAMETER.concat(RANGE)
    },
    response: {
      ...defaultResponse,
      200: mixed<WithTotal<WordWithExamples, "words">>()
    }
  },
  addWord: {
    request: {
      ...defaultRequest,
      body: object({
        word: EDITABLE_WORD.required()
      })
    },
    response: {
      ...defaultResponse,
      201: mixed<{word: Word}>()
    }
  },
  editWord: {
    request: {
      ...defaultRequest,
      body: object({
        word: EDITABLE_WORD.required()
      })
    },
    response: {
      ...defaultResponse,
      200: mixed<{word: Word}>()
    }
  },
  discardWord: {
    request: {
      ...defaultRequest,
      body: mixed<never>()
    },
    response: {
      ...defaultResponse,
      200: mixed<{word: Word}>()
    }
  },
  searchExamples: {
    request: {
      ...defaultRequest,
      query: RANGE
    },
    response: {
      ...defaultResponse,
      200: mixed<WithTotal<Example, "examples">>()
    }
  },
  addExample: {
    request: {
      ...defaultRequest,
      body: object({
        example: EDITABLE_EXAMPLE.required()
      })
    },
    response: {
      ...defaultResponse,
      201: mixed<{example: Example}>()
    }
  },
  editExample: {
    request: {
      ...defaultRequest,
      body: object({
        example: EDITABLE_EXAMPLE.required()
      })
    },
    response: {
      ...defaultResponse,
      200: mixed<{example: Example}>()
    }
  },
  discardExample: {
    request: {
      ...defaultRequest,
      body: mixed<never>()
    },
    response: {
      ...defaultResponse,
      200: mixed<{example: Example}>()
    }
  },
  searchExampleOffers: {
    request: {
      ...defaultRequest,
      query: NORMAL_EXAMPLE_OFFER_PARAMETER.concat(RANGE)
    },
    response: {
      ...defaultResponse,
      200: mixed<WithTotal<ExampleOffer, "exampleOffers">>()
    }
  }
} as const;

export type RequestType = "query" | "body";
export type ResponseCode = keyof typeof defaultResponse;
export type ProcessName = keyof ServerSpecs;

type ServerSpecs = typeof SERVER_SCHEMATA;

export type RequestData<N extends ProcessName, T extends RequestType> = InferType<ServerSpecs[N]["request"][T]>;
export type ResponseData<N extends ProcessName, T extends ResponseCode> = InferType<ServerSpecs[N]["response"][T]>;