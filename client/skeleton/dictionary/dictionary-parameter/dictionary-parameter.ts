//

import {
  NormalDictionaryParameter
} from "/client/skeleton/dictionary";
import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export abstract class DictionaryParameter {

  public static deserialize(search: Record<string, unknown>): DictionaryParameter {
    return NormalDictionaryParameter.deserializeEach(search);
  }

  public abstract serialize(): Record<string, unknown>;

}


export const DICTIONARY_ORDER_MODES = ["updatedDate", "createdDate"] as const;
export type DictionaryOrderMode = LiteralType<typeof DICTIONARY_ORDER_MODES>;
export const DictionaryOrderModeUtil = LiteralUtilType.create(DICTIONARY_ORDER_MODES);

export const DICTIONARY_ORDER_DIRECTIONS = ["ascending", "descending"] as const;
export type DictionaryOrderDirection = LiteralType<typeof DICTIONARY_ORDER_DIRECTIONS>;
export const DictionaryOrderDirectionUtil = LiteralUtilType.create(DICTIONARY_ORDER_DIRECTIONS);

export type DictionaryOrder = {mode: DictionaryOrderMode, direction: DictionaryOrderDirection};