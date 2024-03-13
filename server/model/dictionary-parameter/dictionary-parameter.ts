//

import {Jsonify} from "jsonify-type";
import type {
  DictionaryParameter as DictionaryParameterSkeleton,
  NormalDictionaryParameter as NormalDictionaryParameterSkeleton
} from "/client/skeleton";
import {Dictionary} from "/server/model/dictionary/dictionary";
import {NormalDictionaryParameter} from "/server/model/dictionary-parameter/normal-dictionary-parameter";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";
import {QueryLike} from "/server/util/query";


export abstract class DictionaryParameter {

  public abstract createQuery(): QueryLike<Array<Dictionary>, Dictionary>;

  protected static createSortKey(order: DictionaryOrder): string {
    const mode = order.mode;
    const directionChar = (order.direction === "ascending") ? "" : "-";
    if (mode === "updatedDate") {
      return directionChar + "updatedDate _id";
    } else if (mode === "createdDate") {
      return directionChar + "createdDate _id";
    } else {
      throw new Error("cannot happen");
    }
  }

}


export class DictionaryParameterCreator {

  public static recreate(skeleton: Jsonify<DictionaryParameterSkeleton>): DictionaryParameter {
    const castSkeleton = skeleton as NormalDictionaryParameterSkeleton;
    const raw = new NormalDictionaryParameter(castSkeleton.text, castSkeleton.userName, castSkeleton.order);
    return raw;
  }

}


export const DICTIONARY_ORDER_MODES = ["updatedDate", "createdDate"] as const;
export type DictionaryOrderMode = LiteralType<typeof DICTIONARY_ORDER_MODES>;
export const DictionaryOrderModeUtil = LiteralUtilType.create(DICTIONARY_ORDER_MODES);

export const DICTIONARY_ORDER_DIRECTIONS = ["ascending", "descending"] as const;
export type DictionaryOrderDirection = LiteralType<typeof DICTIONARY_ORDER_DIRECTIONS>;
export const DictionaryOrderDirectionUtil = LiteralUtilType.create(DICTIONARY_ORDER_DIRECTIONS);

export type DictionaryOrder = {mode: DictionaryOrderMode, direction: DictionaryOrderDirection};