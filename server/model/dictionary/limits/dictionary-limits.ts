//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {DeepRequired} from "ts-essentials";
import {DEFAULT_DICTIONARY_LIMITS} from "/server/model/constant";
import {DictionaryArticleLimitsSchema} from "/server/model/dictionary/limits/dictionary-article-limits";
import {DictionaryDictionaryLimitsSchema} from "/server/model/dictionary/limits/dictionary-dictionary-limits";
import {DictionaryExampleLimitsSchema} from "/server/model/dictionary/limits/dictionary-example-limits";
import {DictionaryWordLimitsSchema} from "/server/model/dictionary/limits/dictionary-word-limits";


@modelOptions({schemaOptions: {autoCreate: false, collection: "dictionaryLimits"}})
export class DictionaryLimitsSchema {

  @prop()
  public dictionary?: DictionaryDictionaryLimitsSchema;

  @prop()
  public word?: DictionaryWordLimitsSchema;

  @prop()
  public example?: DictionaryExampleLimitsSchema;

  @prop()
  public article?: DictionaryArticleLimitsSchema;

  /** 設定されていない項目を既定値で補完した上限値を返します。
   * 上限値の検査は、必ずこのメソッドを通して得た値に対して行ってください。*/
  public resolve(this: DictionaryLimits): ResolvedDictionaryLimits {
    const resolvedLimits = {
      dictionary: {
        uploadFileSize: this.dictionary?.uploadFileSize ?? DEFAULT_DICTIONARY_LIMITS.dictionary.uploadFileSize,
        wordCountPerDictionary: this.dictionary?.wordCountPerDictionary ?? DEFAULT_DICTIONARY_LIMITS.dictionary.wordCountPerDictionary,
        exampleCountPerDictionary: this.dictionary?.exampleCountPerDictionary ?? DEFAULT_DICTIONARY_LIMITS.dictionary.exampleCountPerDictionary,
        articleCountPerDictionary: this.dictionary?.articleCountPerDictionary ?? DEFAULT_DICTIONARY_LIMITS.dictionary.articleCountPerDictionary
      },
      word: {
        size: this.word?.size ?? DEFAULT_DICTIONARY_LIMITS.word.size,
        spellingLength: this.word?.spellingLength ?? DEFAULT_DICTIONARY_LIMITS.word.spellingLength,
        pronunciationLength: this.word?.pronunciationLength ?? DEFAULT_DICTIONARY_LIMITS.word.pronunciationLength,
        tagCount: this.word?.tagCount ?? DEFAULT_DICTIONARY_LIMITS.word.tagCount,
        tagLength: this.word?.tagLength ?? DEFAULT_DICTIONARY_LIMITS.word.tagLength,
        sectionCount: this.word?.sectionCount ?? DEFAULT_DICTIONARY_LIMITS.word.sectionCount,
        equivalentCountPerSection: this.word?.equivalentCountPerSection ?? DEFAULT_DICTIONARY_LIMITS.word.equivalentCountPerSection,
        informationCountPerSection: this.word?.informationCountPerSection ?? DEFAULT_DICTIONARY_LIMITS.word.informationCountPerSection,
        phraseCountPerSection: this.word?.phraseCountPerSection ?? DEFAULT_DICTIONARY_LIMITS.word.phraseCountPerSection,
        variationCountPerSection: this.word?.variationCountPerSection ?? DEFAULT_DICTIONARY_LIMITS.word.variationCountPerSection,
        relationCountPerSection: this.word?.relationCountPerSection ?? DEFAULT_DICTIONARY_LIMITS.word.relationCountPerSection,
        informationTitleLength: this.word?.informationTitleLength ?? DEFAULT_DICTIONARY_LIMITS.word.informationTitleLength,
        informationTextLength: this.word?.informationTextLength ?? DEFAULT_DICTIONARY_LIMITS.word.informationTextLength
      },
      example: {
        size: this.example?.size ?? DEFAULT_DICTIONARY_LIMITS.example.size,
        sentenceLength: this.example?.sentenceLength ?? DEFAULT_DICTIONARY_LIMITS.example.sentenceLength,
        translationLength: this.example?.translationLength ?? DEFAULT_DICTIONARY_LIMITS.example.translationLength,
        supplementLength: this.example?.supplementLength ?? DEFAULT_DICTIONARY_LIMITS.example.supplementLength,
        tagCount: this.example?.tagCount ?? DEFAULT_DICTIONARY_LIMITS.example.tagCount,
        tagLength: this.example?.tagLength ?? DEFAULT_DICTIONARY_LIMITS.example.tagLength,
        wordCount: this.example?.wordCount ?? DEFAULT_DICTIONARY_LIMITS.example.wordCount
      },
      article: {
        size: this.article?.size ?? DEFAULT_DICTIONARY_LIMITS.article.size,
        titleLength: this.article?.titleLength ?? DEFAULT_DICTIONARY_LIMITS.article.titleLength,
        contentLength: this.article?.contentLength ?? DEFAULT_DICTIONARY_LIMITS.article.contentLength,
        tagCount: this.article?.tagCount ?? DEFAULT_DICTIONARY_LIMITS.article.tagCount,
        tagLength: this.article?.tagLength ?? DEFAULT_DICTIONARY_LIMITS.article.tagLength
      }
    } satisfies ResolvedDictionaryLimits;
    return resolvedLimits;
  }

  public static createDefault(): DictionaryLimits {
    const limits = new DictionaryLimitsModel({});
    return limits;
  }

}


export type ResolvedDictionaryLimits = DeepRequired<Pick<DictionaryLimitsSchema, "dictionary" | "word" | "example" | "article">>;

export type DictionaryLimits = DictionaryLimitsSchema;
export const DictionaryLimitsModel = getModelForClass(DictionaryLimitsSchema);
