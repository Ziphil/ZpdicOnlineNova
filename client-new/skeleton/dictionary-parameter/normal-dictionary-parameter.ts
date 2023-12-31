/* eslint-disable @typescript-eslint/no-namespace */

import {DictionaryOrder} from "/client-new/skeleton/dictionary-parameter/dictionary-parameter";


export interface NormalDictionaryParameter {

  text: string;
  userName: string | null;
  order: DictionaryOrder;

}


export namespace NormalDictionaryParameter {

  export const EMPTY = {
    text: "",
    userName: null,
    order: {mode: "updatedDate", direction: "descending"}
  } satisfies NormalDictionaryParameter;

}