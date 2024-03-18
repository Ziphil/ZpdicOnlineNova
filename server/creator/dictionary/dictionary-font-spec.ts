//

import type {
  DictionaryFontSpec as DictionaryFontSpecSkeleton
} from "/client/skeleton";
import {
  DictionaryFontSpec
} from "/server/model";


export namespace DictionaryFontSpecCreator {

  export function create(raw: DictionaryFontSpec): DictionaryFontSpecSkeleton {
    if (raw.type === "none") {
      const type = "none" as const;
      const skeleton = {type};
      return skeleton;
    } else if (raw.type === "local") {
      const type = "local" as const;
      const name = raw.name ?? "";
      const skeleton = {type, name};
      return skeleton;
    } else if (raw.type === "custom") {
      const type = "custom" as const;
      const format = raw.format ?? "";
      const skeleton = {type, format};
      return skeleton;
    } else {
      throw new Error("cannot happen");
    }
  }

}