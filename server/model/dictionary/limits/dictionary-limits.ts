//

import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose";
import {DeepRequired} from "ts-essentials";
import {DEFAULT_DICTIONARY_LIMITS, DICTIONARY_LIMITS} from "/server/model/constant";
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
   * システム全体の上限が定められている項目については、その値で頭打ちにします。
   * 上限値の検査は、必ずこのメソッドを通して得た値に対して行ってください。*/
  public resolve(this: DictionaryLimits): ResolvedDictionaryLimits {
    const resolvedLimits = {
      dictionary: resolveEachLimits(this.dictionary, DEFAULT_DICTIONARY_LIMITS.dictionary),
      word: resolveEachLimits(this.word, DEFAULT_DICTIONARY_LIMITS.word, DICTIONARY_LIMITS.word),
      example: resolveEachLimits(this.example, DEFAULT_DICTIONARY_LIMITS.example, DICTIONARY_LIMITS.example),
      article: resolveEachLimits(this.article, DEFAULT_DICTIONARY_LIMITS.article, DICTIONARY_LIMITS.article)
    } satisfies ResolvedDictionaryLimits;
    return resolvedLimits;
  }

  public static createDefault(): DictionaryLimits {
    const limits = new DictionaryLimitsModel({});
    return limits;
  }

}


function resolveEachLimits<T extends Record<string, number>>(limits: EachLimits<T>, defaultLimits: T, capLimits?: EachLimits<T>): ResolvedEachValues<T> {
  const entries = Object.entries(defaultLimits).map(([key, defaultValue]) => {
    const value = limits?.[key as keyof T] ?? defaultValue;
    const capValue = capLimits?.[key as keyof T];
    return [key, (capValue !== undefined) ? Math.min(value, capValue) : value];
  });
  const resolvedLimits = Object.fromEntries(entries) as ResolvedEachValues<T>;
  return resolvedLimits;
}

type ResolvedEachValues<T> = {[K in keyof T]: number};
type EachLimits<T> = Partial<Record<keyof T, number>> | undefined;

export type ResolvedDictionaryLimits = DeepRequired<Pick<DictionaryLimitsSchema, "dictionary" | "word" | "example" | "article">>;

export type DictionaryLimits = DictionaryLimitsSchema;
export const DictionaryLimitsModel = getModelForClass(DictionaryLimitsSchema);
