//

import {Search} from "/client/hook/search";
import {AdvancedWordParameter} from "/client/skeleton/word-parameter/advanced-word-parameter";
import {ExactWordParameter} from "/client/skeleton/word-parameter/exact-word-parameter";
import {NormalWordParameter} from "/client/skeleton/word-parameter/normal-word-parameter";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export type WordParameter = NormalWordParameter | AdvancedWordParameter | ExactWordParameter;

export const WORD_MODES = ["name", "equivalent", "both", "tag", "information", "variation", "relation", "content"] as const;
export type WordMode = LiteralType<typeof WORD_MODES>;
export const WordModeUtil = LiteralUtilType.create(WORD_MODES);

export const WORD_TYPES = ["exact", "prefix", "suffix", "part", "regular"] as const;
export type WordType = LiteralType<typeof WORD_TYPES>;
export const WordTypeUtil = LiteralUtilType.create(WORD_TYPES);

export const WORD_ORDER_MODES = ["unicode", "custom", "updatedDate", "createdDate"] as const;
export type WordOrderMode = LiteralType<typeof WORD_ORDER_MODES>;
export const WordOrderModeUtil = LiteralUtilType.create(WORD_ORDER_MODES);

export const WORD_ORDER_DIRECTIONS = ["ascending", "descending"] as const;
export type WordOrderDirection = LiteralType<typeof WORD_ORDER_DIRECTIONS>;
export const WordOrderDirectionUtil = LiteralUtilType.create(WORD_ORDER_DIRECTIONS);

export type WordOrder = {mode: WordOrderMode, direction: WordOrderDirection};
export type WordIgnoreOptions = {case: boolean};


export namespace WordParameter {

  export function deserialize(search: Search): WordParameter {
    if (search.get("kind") === "advanced") {
      return AdvancedWordParameter.deserialize(search);
    } else if (search.get("kind") === "exact") {
      return ExactWordParameter.deserialize(search);
    } else {
      return NormalWordParameter.deserialize(search);
    }
  }

  export function serialize(parameter: WordParameter): Search {
    if (parameter.kind === "advanced") {
      return AdvancedWordParameter.serialize(parameter);
    } else if (parameter.kind === "exact") {
      return ExactWordParameter.serialize(parameter);
    } else {
      return NormalWordParameter.serialize(parameter);
    }
  }

  export function toNormal(parameter: WordParameter): NormalWordParameter {
    if (parameter.kind === "advanced" || parameter.kind === "exact") {
      return NormalWordParameter.EMPTY;
    } else {
      return parameter;
    }
  }

}