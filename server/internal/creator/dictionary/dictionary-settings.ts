//

import {DictionaryFontCreator} from "/server/internal/creator/dictionary/dictionary-font";
import {TemplateWordCreator} from "/server/internal/creator/word/template-word";
import type {
  DictionarySettings as DictionarySettingsSkeleton
} from "/server/internal/skeleton";
import {
  DictionarySettings
} from "/server/model";


export namespace DictionarySettingsCreator {

  export function skeletonize(raw: DictionarySettings): DictionarySettingsSkeleton {
    const skeleton = {
      akrantiainSource: raw.akrantiainSource,
      zatlinSource: raw.zatlinSource,
      font: (raw.font !== undefined) ? DictionaryFontCreator.skeletonize(raw.font) : undefined,
      templateWords: (raw.templateWords !== undefined) ? raw.templateWords.map(TemplateWordCreator.skeletonize) : [],
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