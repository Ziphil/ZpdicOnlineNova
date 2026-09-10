//


export interface DictionaryLimits {

  dictionary: {
    wordCount: number,
    exampleCount: number,
    articleCount: number
  };
  word: {
    size: number,
    spellingLength: number,
    pronunciationLength: number,
    tagCount: number,
    tagLength: number,
    sectionCount: number,
    equivalentCountPerSection: number,
    informationCountPerSection: number,
    phraseCountPerSection: number,
    variationCountPerSection: number,
    relationCountPerSection: number,
    informationTitleLength: number,
    informationTextLength: number
  };
  example: {
    size: number,
    sentenceLength: number,
    translationLength: number,
    supplementLength: number,
    tagCount: number,
    tagLength: number,
    wordCount: number
  };
  article: {
    size: number,
    titleLength: number,
    contentLength: number,
    tagCount: number,
    tagLength: number
  };

}
