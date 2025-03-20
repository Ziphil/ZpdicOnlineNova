//

import type {
  DictionaryFont as DictionaryFontSkeleton
} from "/client/skeleton";
import {
  DictionaryFont
} from "/server/model";


export namespace DictionaryFontCreator {

  export function skeletonize(raw: DictionaryFont): DictionaryFontSkeleton {
    if (raw.type === "none") {
      const skeleton = {
        type: "none"
      } satisfies DictionaryFontSkeleton;
      return skeleton;
    } else if (raw.type === "local") {
      const skeleton = {
        type: "local",
        name: raw.name ?? ""
      } satisfies DictionaryFontSkeleton;
      return skeleton;
    } else if (raw.type === "custom") {
      const skeleton = {
        type: "custom",
        name: raw.name ?? "",
        format: raw.format ?? ""
      } satisfies DictionaryFontSkeleton;
      return skeleton;
    } else {
      throw new Error("cannot happen");
    }
  }

}