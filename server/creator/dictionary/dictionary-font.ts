//

import type {
  DictionaryFont as DictionaryFontSkeleton
} from "/client/skeleton";
import {
  DictionaryFont
} from "/server/model";


export namespace DictionaryFontCreator {

  export function create(raw: DictionaryFont): DictionaryFontSkeleton {
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