//

import {DictionaryFontCreator} from "/server/internal/creator/dictionary/dictionary-font";
import {TemplateWordCreator} from "/server/internal/creator/template-word/template-word";
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
      font: (raw.font !== undefined) ? DictionaryFontCreator.skeletonize(raw.font) : {kind: "none"},
      fontTargets: raw.fontTargets as any ?? [],
      templateWords: (raw.templateWords !== undefined) ? raw.templateWords.map(TemplateWordCreator.skeletonize) : [],
      punctuations: raw.punctuations,
      ignoredEquivalentPattern: raw.ignoredEquivalentPattern ?? "",
      pronunciationTitle: raw.pronunciationTitle,
      phraseTitle: raw.phraseTitle ?? "成句",
      exampleTitle: raw.exampleTitle ?? "例文",
      markdownFeatures: raw.markdownFeatures as any ?? [],
      enableAdvancedWord: raw.enableAdvancedWord ?? false,
      enableProposal: raw.enableProposal ?? true,
      enableDuplicateName: raw.enableDuplicateName,
      showVariationPronunciation: raw.showVariationPronunciation ?? true,
      showEquivalentNumber: raw.showEquivalentNumber,
      showSectionNumber: raw.showSectionNumber ?? true
    } satisfies DictionarySettingsSkeleton;
    return skeleton;
  }

}