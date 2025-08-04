/* eslint-disable @typescript-eslint/naming-convention */

import {InferType, mixed, object} from "yup";
import {
  EditableExample$In,
  EditableWord$In,
  Example$Out,
  ExampleOffer$Out,
  NormalExampleOfferParameter$In,
  NormalExampleParameter$In,
  NormalWordParameter$In,
  Range,
  WithTotal,
  Word$Out,
  WordWithExamples$Out
} from "/server/external/schema";
import {defaultRequest, defaultResponse} from "/server/external/type/util";


export const SERVER_PATH_PREFIX = "/api/v0";

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
  },
  searchExamples: {
    request: {
      ...defaultRequest,
      query: NormalExampleParameter$In.concat(Range)
    },
    response: {
      ...defaultResponse,
      200: mixed<WithTotal<Example$Out, "examples">>()
    }
  },
  fetchExample: {
    request: {
      ...defaultRequest,
      query: mixed<never>()
    },
    response: {
      ...defaultResponse,
      200: mixed<{example: Example$Out}>()
    }
  },
  addExample: {
    request: {
      ...defaultRequest,
      body: object({
        example: EditableExample$In.required()
      })
    },
    response: {
      ...defaultResponse,
      201: mixed<{example: Example$Out}>()
    }
  },
  editExample: {
    request: {
      ...defaultRequest,
      body: object({
        example: EditableExample$In.required()
      })
    },
    response: {
      ...defaultResponse,
      200: mixed<{example: Example$Out}>()
    }
  },
  discardExample: {
    request: {
      ...defaultRequest,
      body: mixed<never>()
    },
    response: {
      ...defaultResponse,
      200: mixed<{example: Example$Out}>()
    }
  },
  searchExampleOffers: {
    request: {
      ...defaultRequest,
      query: NormalExampleOfferParameter$In.concat(Range)
    },
    response: {
      ...defaultResponse,
      200: mixed<WithTotal<ExampleOffer$Out, "exampleOffers">>()
    }
  },
  fetchExampleOffer: {
    request: {
      ...defaultRequest,
      query: mixed<never>()
    },
    response: {
      ...defaultResponse,
      200: mixed<{exampleOffer: ExampleOffer$Out}>()
    }
  }
} as const;

export type RequestType = "query" | "body";
export type ResponseCode = keyof typeof defaultResponse;
export type ProcessName = keyof ServerSpecs;

type ServerSpecs = typeof SERVER_SCHEMATA;

export type RequestData<N extends ProcessName, T extends RequestType> = InferType<ServerSpecs[N]["request"][T]>;
export type ResponseData<N extends ProcessName, T extends ResponseCode> = InferType<ServerSpecs[N]["response"][T]>;