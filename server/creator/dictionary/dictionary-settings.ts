//

import type {
  DictionarySettings as DictionarySettingsSkeleton
} from "/client/skeleton";
import {DictionaryFontCreator} from "/server/creator/dictionary/dictionary-font";
import {
  DictionarySettings
} from "/server/model";


export namespace DictionarySettingsCreator {

  export function skeletonize(raw: DictionarySettings): DictionarySettingsSkeleton {
    const skeleton = {
      akrantiainSource: raw.akrantiainSource,
      zatlinSource: raw.zatlinSource,
      font: (raw.font !== undefined) ? DictionaryFontCreator.skeletonize(raw.font) : undefined,
      punctuations: raw.punctuations,
      ignoredEquivalentPattern: raw.ignoredEquivalentPattern,
      pronunciationTitle: raw.pronunciationTitle,
      exampleTitle: raw.exampleTitle,
      enableMarkdown: raw.enableMarkdown,
      enableDuplicateName: raw.enableDuplicateName,
      showEquivalentNumber: raw.showEquivalentNumber
    } satisfies DictionarySettingsSkeleton;
    return skeleton;
  }

}