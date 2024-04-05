//

import {Dictionary} from "/server/model/dictionary/dictionary";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";
import {QueryLike} from "/server/util/query";


export abstract class DictionaryParameter {

  public abstract createQuery(): QueryLike<Array<Dictionary>, Dictionary>;

  protected static createSortKey(order: DictionaryOrder): string {
    const mode = order.mode;
    const directionSign = (order.direction === "ascending") ? "" : "-";
    if (mode === "updatedDate") {
      return `${directionSign}updatedDate _id`;
    } else if (mode === "createdDate") {
      return `${directionSign}createdDate _id`;
    } else {
      throw new Error("cannot happen");
    }
  }

}


export const DICTIONARY_ORDER_MODES = ["updatedDate", "createdDate"] as const;
export type DictionaryOrderMode = LiteralType<typeof DICTIONARY_ORDER_MODES>;
export const DictionaryOrderModeUtil = LiteralUtilType.create(DICTIONARY_ORDER_MODES);

export const DICTIONARY_ORDER_DIRECTIONS = ["ascending", "descending"] as const;
export type DictionaryOrderDirection = LiteralType<typeof DICTIONARY_ORDER_DIRECTIONS>;
export const DictionaryOrderDirectionUtil = LiteralUtilType.create(DICTIONARY_ORDER_DIRECTIONS);

export type DictionaryOrder = {mode: DictionaryOrderMode, direction: DictionaryOrderDirection};