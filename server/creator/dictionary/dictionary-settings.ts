//

import type {
  DictionarySettings as DictionarySettingsSkeleton
} from "/client/skeleton";
import {DictionaryFontSpecCreator} from "/server/creator/dictionary/dictionary-font-spec";
import {
  DictionarySettings
} from "/server/model";


export namespace DictionarySettingsCreator {

  export function create(raw: DictionarySettings): DictionarySettingsSkeleton {
    const akrantiainSource = raw.akrantiainSource;
    const zatlinSource = raw.zatlinSource;
    const fontSpec = (raw.fontSpec !== undefined) ? DictionaryFontSpecCreator.create(raw.fontSpec) : undefined;
    const punctuations = raw.punctuations;
    const pronunciationTitle = raw.pronunciationTitle;
    const exampleTitle = raw.exampleTitle;
    const enableMarkdown = raw.enableMarkdown;
    const enableDuplicateName = raw.enableDuplicateName;
    const skeleton = {akrantiainSource, zatlinSource, fontSpec, punctuations, pronunciationTitle, exampleTitle, enableMarkdown, enableDuplicateName};
    return skeleton;
  }

}