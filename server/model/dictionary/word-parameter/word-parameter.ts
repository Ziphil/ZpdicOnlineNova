//

import {
  Jsonify
} from "jsonify-type";
import {
  Aggregate,
  Query
} from "mongoose";
import {
  AdvancedWordParameter as AdvancedWordParameterSkeleton,
  NormalWordParameter as NormalWordParameterSkeleton,
  WordParameter as WordParameterSkeleton
} from "/client/skeleton/dictionary";
import {
  AdvancedWordParameter,
  AdvancedWordParameterElement,
  Dictionary,
  NormalWordParameter,
  Word
} from "/server/model/dictionary";
import {
  LiteralType,
  LiteralUtilType
} from "/server/util/literal-type";
import {
  escapeRegexp
} from "/server/util/misc";


export abstract class WordParameter {

  public abstract createQuery(dictionary: Dictionary): Query<Array<Word>, Word> | Aggregate<Array<Word>>;

  // この検索パラメータからサジェストされる単語を検索するためのクエリを返します。
  // 何もサジェストする必要がない場合は null を返します。
  public abstract createSuggestionQuery(dictionary: Dictionary): Aggregate<Array<RawSuggestion>> | null;

  protected static createKeys(mode: WordMode): Array<string> {
    if (mode === "name") {
      return ["name"];
    } else if (mode === "equivalent") {
      return ["equivalents.names"];
    } else if (mode === "both") {
      return ["name", "equivalents.names"];
    } else if (mode === "tag") {
      return ["tags"];
    } else if (mode === "information") {
      return ["informations.text"];
    } else {
      return ["name", "equivalents.names", "informations.text"];
    }
  }

  protected static createNeedle(text: string, type: WordType, ignoreOptions: WordIgnoreOptions): string | RegExp {
    let escapedText = escapeRegexp(text);
    if (type === "exact") {
      if (ignoreOptions.case) {
        return new RegExp("^" + escapedText + "$", "i");
      } else {
        return text;
      }
    } else if (type === "prefix") {
      let flags = (ignoreOptions.case) ? "i" : undefined;
      return new RegExp("^" + escapedText, flags);
    } else if (type === "suffix") {
      let flags = (ignoreOptions.case) ? "i" : undefined;
      return new RegExp(escapedText + "$", flags);
    } else if (type === "part") {
      let flags = (ignoreOptions.case) ? "i" : undefined;
      return new RegExp(escapedText, flags);
    } else {
      try {
        let flags = (ignoreOptions.case) ? "i" : undefined;
        return new RegExp(text, flags);
      } catch (error) {
        return "";
      }
    }
  }

  protected static createSortKey(order: WordOrder): string {
    let mode = order.mode;
    let directionChar = (order.direction === "ascending") ? "" : "-";
    if (mode === "unicode") {
      return directionChar + "name _id";
    } else if (mode === "custom") {
      return directionChar + "sortString _id";
    } else if (mode === "updatedDate") {
      return directionChar + "updatedDate _id";
    } else if (mode === "createdDate") {
      return directionChar + "createdDate _id";
    } else {
      throw new Error("cannot happen");
    }
  }

}


export class WordParameterCreator {

  public static recreate(skeleton: Jsonify<WordParameterSkeleton>): WordParameter {
    if ("elements" in skeleton) {
      let castSkeleton = skeleton as AdvancedWordParameterSkeleton;
      let elements = castSkeleton.elements.map((element) => new AdvancedWordParameterElement(element.text, element.title, element.mode, element.type));
      let raw = new AdvancedWordParameter(elements);
      return raw;
    } else {
      let castSkeleton = skeleton as NormalWordParameterSkeleton;
      let raw = new NormalWordParameter(castSkeleton.text, castSkeleton.mode, castSkeleton.type, castSkeleton.order, castSkeleton.ignoreOptions);
      return raw;
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
export type WordIgnoreOptions = {case: boolean};
export type RawSuggestion = {title: string, word: Word};