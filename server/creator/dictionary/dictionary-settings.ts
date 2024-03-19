//

import type {
  DictionarySettings as DictionarySettingsSkeleton
} from "/client/skeleton";
import {DictionaryFontCreator} from "/server/creator/dictionary/dictionary-font";
import {
  DictionarySettings
} from "/server/model";


export namespace DictionarySettingsCreator {

  export function create(raw: DictionarySettings): DictionarySettingsSkeleton {
    const akrantiainSource = raw.akrantiainSource;
    const zatlinSource = raw.zatlinSource;
    const font = (raw.font !== undefined) ? DictionaryFontCreator.create(raw.font) : undefined;
    const punctuations = raw.punctuations;
    const pronunciationTitle = raw.pronunciationTitle;
    const exampleTitle = raw.exampleTitle;
    const enableMarkdown = raw.enableMarkdown;
    const enableDuplicateName = raw.enableDuplicateName;
    const skeleton = {akrantiainSource, zatlinSource, font, punctuations, pronunciationTitle, exampleTitle, enableMarkdown, enableDuplicateName};
    return skeleton;
  }

}