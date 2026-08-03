//


export const USER_LIMITS = {
  dictionaryCountPerUser: 50
} as const;

export const DICTIONARY_LIMITS = {
  wordCountPerDictionary: 15000,
  exampleCountPerDictionary: 2000,
  articleCountPerDictionary: 200
} as const;

export const WORD_LIMITS = {
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
} as const;

export const EXAMPLE_LIMITS = {
  size: 16 * 1024,
  sentenceLength: 5000,
  translationLength: 5000,
  supplementLength: 5000,
  tagCount: 10,
  tagLength: 100,
  wordCount: 200
} as const;

export const TEMPLATE_WORD_LIMITS = {
  titleLength: 100
} as const;

export const PROPOSAL_LIMITS = {
  termLength: 200,
  commentLength: 1000
} as const;

export const ARTICLE_LIMITS = {
  size: 128 * 1024,
  titleLength: 200,
  contentLength: 100000,
  tagCount: 10,
  tagLength: 100
} as const;
