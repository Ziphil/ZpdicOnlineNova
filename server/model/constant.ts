//


export const RETENTION_PERIODS = {
  history: 120 * 24 * 60 * 60,
  oldData: 90 * 24 * 60 * 60
} as const;

export const USER_LIMITS = {
  dictionaryCountPerUser: 50
} as const;

/** 辞書に登録されるデータの上限値のうち、システム全体で共通のものです。
 * スキーマ定義に直接埋め込まれるため辞書ごとに変えることはできず、辞書ごとに設定できる上限値の上界として機能します。*/
export const DICTIONARY_LIMITS = {
  dictionary: {
    uploadFileSize: 32 * 1024 * 1024,
    wordCountPerDictionary: 15000,
    exampleCountPerDictionary: 2000,
    articleCountPerDictionary: 200
  },
  word: {
    size: 64 * 1024,
    spellingLength: 200,
    pronunciationLength: 200,
    tagCount: 20,
    tagLength: 100,
    sectionCount: 10,
    equivalentCountPerSection: 30,
    informationCountPerSection: 20,
    phraseCountPerSection: 20,
    variationCountPerSection: 100,
    relationCountPerSection: 100,
    informationTitleLength: 100,
    informationTextLength: 20000
  },
  example: {
    size: 16 * 1024,
    sentenceLength: 5000,
    translationLength: 5000,
    supplementLength: 5000,
    tagCount: 10,
    tagLength: 100,
    wordCount: 200
  },
  article: {
    size: 128 * 1024,
    titleLength: 200,
    contentLength: 100000,
    tagCount: 10,
    tagLength: 100
  }
} as const;

export const DEFAULT_DICTIONARY_LIMITS = {
  dictionary: {
    uploadFileSize: 32 * 1024 * 1024,
    wordCountPerDictionary: 15000,
    exampleCountPerDictionary: 2000,
    articleCountPerDictionary: 200
  },
  word: {
    size: 64 * 1024,
    spellingLength: 200,
    pronunciationLength: 200,
    tagCount: 20,
    tagLength: 100,
    sectionCount: 10,
    equivalentCountPerSection: 30,
    informationCountPerSection: 20,
    phraseCountPerSection: 20,
    variationCountPerSection: 100,
    relationCountPerSection: 100,
    informationTitleLength: 100,
    informationTextLength: 20000
  },
  example: {
    size: 16 * 1024,
    sentenceLength: 5000,
    translationLength: 5000,
    supplementLength: 5000,
    tagCount: 10,
    tagLength: 100,
    wordCount: 200
  },
  article: {
    size: 128 * 1024,
    titleLength: 200,
    contentLength: 100000,
    tagCount: 10,
    tagLength: 100
  }
} as const;

export const TEMPLATE_WORD_LIMITS = {
  titleLength: 100
} as const;

export const PROPOSAL_LIMITS = {
  termLength: 200,
  commentLength: 1000
} as const;
