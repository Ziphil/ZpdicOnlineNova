//

import {Aggregate} from "mongoose";
import {Dictionary} from "/server/model/dictionary/dictionary";
import {Word} from "/server/model/word/word";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";
import {escapeRegexp} from "/server/util/misc";
import {QueryLike} from "/server/util/query";


export abstract class WordParameter {

  public abstract createQuery(dictionary: Dictionary): QueryLike<Array<Word>, Word>;

  /** この検索パラメータからサジェストされる単語を検索するためのクエリを返します。
   * 何もサジェストする必要がない場合は `null` を返します。*/
  public abstract createSuggestionQuery(dictionary: Dictionary): Aggregate<Array<RawSuggestion>> | null;

  protected static createKeys(mode: WordMode): Array<string> {
    if (mode === "name") {
      return ["name"];
    } else if (mode === "equivalent") {
      return ["equivalents.names", "phrases.translations"];
    } else if (mode === "both") {
      return ["name", "equivalents.names", "phrases.translations"];
    } else if (mode === "tag") {
      return ["tags"];
    } else if (mode === "information") {
      return ["informations.text"];
    } else if (mode === "variation") {
      return ["variations.name"];
    } else if (mode === "relation") {
      return ["relations.name"];
    } else if (mode === "content") {
      return ["name", "equivalents.names", "phrases.translations", "informations.text", "variations.name", "relations.name"];
    } else {
      const dummy = mode satisfies never;
      throw new Error("cannot happen");
    }
  }

  protected static createNeedle(text: string, type: WordType, ignoreOptions: WordIgnoreOptions): string | RegExp {
    const escapedText = escapeRegexp(text);
    if (type === "exact") {
      if (ignoreOptions.case) {
        return new RegExp("^" + escapedText + "$", "i");
      } else {
        return text;
      }
    } else if (type === "prefix") {
      const flags = (ignoreOptions.case) ? "i" : undefined;
      return new RegExp("^" + escapedText, flags);
    } else if (type === "suffix") {
      const flags = (ignoreOptions.case) ? "i" : undefined;
      return new RegExp(escapedText + "$", flags);
    } else if (type === "part") {
      const flags = (ignoreOptions.case) ? "i" : undefined;
      return new RegExp(escapedText, flags);
    } else if (type === "regular") {
      try {
        const flags = (ignoreOptions.case) ? "i" : undefined;
        return new RegExp(text, flags);
      } catch (error) {
        return "";
      }
    } else {
      const dummy = type satisfies never;
      throw new Error("cannot happen");
    }
  }

  protected static createSortKey(order: WordOrder): string {
    const mode = order.mode;
    const directionSign = (order.direction === "ascending") ? "" : "-";
    if (mode === "unicode") {
      return `${directionSign}name _id`;
    } else if (mode === "custom") {
      return `${directionSign}sortString _id`;
    } else if (mode === "updatedDate") {
      return `${directionSign}updatedDate _id`;
    } else if (mode === "createdDate") {
      return `${directionSign}createdDate _id`;
    } else {
      const dummy = mode satisfies never;
      throw new Error("cannot happen");
    }
  }

}


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
export type RawSuggestion = {title: string, word: Word};