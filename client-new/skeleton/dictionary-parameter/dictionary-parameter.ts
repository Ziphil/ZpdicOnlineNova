/* eslint-disable @typescript-eslint/no-namespace */

import {NormalDictionaryParameter} from "/client-new/skeleton/dictionary-parameter/normal-dictionary-parameter";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export type DictionaryParameter = NormalDictionaryParameter;

export const DICTIONARY_ORDER_MODES = ["updatedDate", "createdDate"] as const;
export type DictionaryOrderMode = LiteralType<typeof DICTIONARY_ORDER_MODES>;
export const DictionaryOrderModeUtil = LiteralUtilType.create(DICTIONARY_ORDER_MODES);

export const DICTIONARY_ORDER_DIRECTIONS = ["ascending", "descending"] as const;
export type DictionaryOrderDirection = LiteralType<typeof DICTIONARY_ORDER_DIRECTIONS>;
export const DictionaryOrderDirectionUtil = LiteralUtilType.create(DICTIONARY_ORDER_DIRECTIONS);

export type DictionaryOrder = {mode: DictionaryOrderMode, direction: DictionaryOrderDirection};


export namespace DictionaryParameter {

  export function deserialize(params: URLSearchParams): DictionaryParameter {
    const parameter = NormalDictionaryParameter.deserialize(params);
    return parameter;
  }

  export function serialize(parameter: DictionaryParameter): URLSearchParams {
    const params = NormalDictionaryParameter.serialize(parameter);
    return params;
  }

}