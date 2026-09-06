//


export const RETENTION_PERIODS = {
  history: 120 * 24 * 60 * 60,
  oldData: 90 * 24 * 60 * 60
} as const;

/** 辞書に登録されるデータの上限値のうち、システム全体で共通のものです。
 * スキーマ定義に直接埋め込まれるため辞書ごとに変えることはできず、辞書ごとに設定できる上限値の上界として機能します。
 * データの個数やデータ全体の大きさの上限はスキーマ定義で表現できないため、ここには含まれません。*/
export const DICTIONARY_LIMITS = {
  word: {
    spellingLength: 1000,
    pronunciationLength: 1000,
    tagCount: 100,
    tagLength: 500,
    sectionCount: 50,
    equivalentCountPerSection: 150,
    informationCountPerSection: 100,
    phraseCountPerSection: 100,
    variationCountPerSection: 500,
    relationCountPerSection: 500,
    informationTitleLength: 500,
    informationTextLength: 100000
  },
  example: {
    sentenceLength: 25000,
    translationLength: 25000,
    supplementLength: 25000,
    tagCount: 50,
    tagLength: 500,
    wordCount: 1000
  },
  article: {
    titleLength: 1000,
    contentLength: 500000,
    tagCount: 50,
    tagLength: 500
  },
  templateWord: {
    titleLength: 100
  },
  proposal: {
    termLength: 200,
    commentLength: 1000
  }
} as const;

export const DEFAULT_DICTIONARY_LIMITS = {
  dictionary: {
    wordCount: 15000,
    exampleCount: 2000,
    articleCount: 200
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

export const USER_LIMITS = {
  dictionaryCountPerUser: 50
} as const;

export const SERVER_LIMITS = {
  uploadFileSize: 32 * 1024 * 1024
} as const;
