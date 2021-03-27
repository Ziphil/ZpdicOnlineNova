//

import * as queryParser from "query-string";
import {
  AdvancedWordParameter,
  NormalWordParameter
} from "/client/skeleton/dictionary";
import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";


export abstract class WordParameter {

  public static deserialize(queryString: string): WordParameter {
    let query = queryParser.parse(queryString);
    if ("advanced" in query) {
      return AdvancedWordParameter.deserializeEach(query);
    } else {
      return NormalWordParameter.deserializeEach(query);
    }
  }

  public abstract serialize(): string;

  public static getNormal(parameter: WordParameter): NormalWordParameter {
    if (parameter instanceof NormalWordParameter) {
      return parameter;
    } else {
      return NormalWordParameter.createEmpty();
    }
  }

}


export const WORD_MODES = ["name", "equivalent", "both", "tag", "information", "content"] as const;
export type WordMode = LiteralType<typeof WORD_MODES>;
export let WordModeUtil = LiteralUtilType.create(WORD_MODES);

export const WORD_TYPES = ["exact", "prefix", "suffix", "part", "regular"] as const;
export type WordType = LiteralType<typeof WORD_TYPES>;
export let WordTypeUtil = LiteralUtilType.create(WORD_TYPES);

export const WORD_ORDER_MODES = ["unicode", "custom", "updatedDate", "createdDate"] as const;
export type WordOrderMode = LiteralType<typeof WORD_ORDER_MODES>;
export let WordOrderModeUtil = LiteralUtilType.create(WORD_ORDER_MODES);

export const WORD_ORDER_DIRECTIONS = ["ascending", "descending"] as const;
export type WordOrderDirection = LiteralType<typeof WORD_ORDER_DIRECTIONS>;
export let WordOrderDirectionUtil = LiteralUtilType.create(WORD_ORDER_DIRECTIONS);

export type WordOrder = {mode: WordOrderMode, direction: WordOrderDirection};