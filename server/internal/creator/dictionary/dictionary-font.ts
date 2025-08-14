//

import type {
  DictionaryFont as DictionaryFontSkeleton
} from "/server/internal/skeleton";
import {
  DictionaryFont
} from "/server/model";


export namespace DictionaryFontCreator {

  export function skeletonize(raw: DictionaryFont): DictionaryFontSkeleton {
    if (raw.kind === "none") {
      const skeleton = {
        kind: "none"
      } satisfies DictionaryFontSkeleton;
      return skeleton;
    } else if (raw.kind === "local") {
      const skeleton = {
        kind: "local",
        name: raw.name ?? ""
      } satisfies DictionaryFontSkeleton;
      return skeleton;
    } else if (raw.kind === "custom") {
      const skeleton = {
        kind: "custom",
        name: raw.name ?? "",
        format: raw.format ?? ""
      } satisfies DictionaryFontSkeleton;
      return skeleton;
    } else {
      const skeleton = {
        kind: "none"
      } satisfies DictionaryFontSkeleton;
      return skeleton;
    }
  }

}