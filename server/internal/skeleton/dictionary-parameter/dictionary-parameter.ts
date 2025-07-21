//

import type {Search} from "/client/hook/search";
import {NormalDictionaryParameter} from "/server/internal/skeleton/dictionary-parameter/normal-dictionary-parameter";
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

  export function deserialize(search: Search): DictionaryParameter {
    return NormalDictionaryParameter.deserialize(search);
  }

  export function serialize(parameter: DictionaryParameter): Search {
    return NormalDictionaryParameter.serialize(parameter);
  }

}