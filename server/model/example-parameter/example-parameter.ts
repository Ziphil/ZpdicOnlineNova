//

import {Dictionary} from "/server/model/dictionary/dictionary";
import {Example} from "/server/model/example/example";
import {LiteralType} from "/server/util/literal-type";
import {LiteralUtilType} from "/server/util/literal-type";
import {escapeRegexp} from "/server/util/misc";
import {QueryLike} from "/server/util/query";


export abstract class ExampleParameter {

  public abstract createQuery(dictionary: Dictionary): QueryLike<Array<Example>, Example>;

  protected static createKeys(mode: ExampleMode): Array<string> {
    if (mode === "sentence") {
      return ["sentence"];
    } else if (mode === "translation") {
      return ["translation"];
    } else if (mode === "both") {
      return ["sentence", "translation"];
    } else if (mode === "tag") {
      return ["tags"];
    } else if (mode === "content") {
      return ["sentence", "translation", "supplement"];
    } else {
      const dummy = mode satisfies never;
      throw new Error("cannot happen");
    }
  }

  protected static createNeedle(text: string, type: ExampleType, ignoreOptions: ExampleIgnoreOptions): string | RegExp {
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

}


export const EXAMPLE_MODES = ["sentence", "translation", "both", "tag", "content"] as const;
export type ExampleMode = LiteralType<typeof EXAMPLE_MODES>;
export const ExampleModeUtil = LiteralUtilType.create(EXAMPLE_MODES);

export const EXAMPLE_TYPES = ["exact", "prefix", "suffix", "part", "regular"] as const;
export type ExampleType = LiteralType<typeof EXAMPLE_TYPES>;
export const ExampleTypeUtil = LiteralUtilType.create(EXAMPLE_TYPES);

export type ExampleIgnoreOptions = {case: boolean};