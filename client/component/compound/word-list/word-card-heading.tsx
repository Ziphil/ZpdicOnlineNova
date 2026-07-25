//

import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, data} from "zographia";
import {create} from "/client/component/create";
import {Dictionary, DictionaryWithExecutors, Word, WordWithExamples} from "/server/internal/skeleton";


export const WordCardHeading = create(
  require("./word-card-heading.scss"), "WordCardHeading",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: Dictionary | DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const pronunciation = useMemo(() => getPronunciation(dictionary, word), [dictionary, word]);
    const showOrdinarySpelling = dictionary.settings.showOrdinarySpelling && dictionary.settings.font.kind !== "none" && dictionary.settings.fontTargets.includes("heading");

    return (word.tags.length > 0 || !!word.spelling) ? (
      <div styleName="root" {...rest}>
        {(word.tags.length > 0) && (
          <div styleName="tag">
            {word.tags.map((tag, index) => (
              <Tag key={index} variant="solid">{tag}</Tag>
            ))}
          </div>
        )}
        {(!!word.spelling) && (
          <div styleName="spelling-container">
            <MultiLineText styleName="spelling" is="h3" lineHeight="narrowFixed">
              <span className="dictionary-custom-font" {...data({target: "heading"})}>{word.spelling}</span>
            </MultiLineText>
            {(showOrdinarySpelling) && (
              <MultiLineText styleName="small-spelling" is="span" lineHeight="narrowFixed">
                {word.spelling}
              </MultiLineText>
            )}
            {(!!pronunciation) && (
              <MultiLineText styleName="pronunciation" is="span" lineHeight="narrow">
                {pronunciation}
              </MultiLineText>
            )}
          </div>
        )}
      </div>
    ) : null;

  }
);


function getPronunciation(dictionary: Dictionary | DictionaryWithExecutors, word: Word | WordWithExamples): string | undefined {
  const akrantiain = ("akrantiain" in dictionary) ? dictionary.akrantiain : null;
  if (!!word.pronunciation) {
    if (word.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
      return word.pronunciation.trim();
    } else {
      return "/" + word.pronunciation.trim() + "/";
    }
  } else {
    if (akrantiain !== null) {
      try {
        const pronunciation = akrantiain.convert(word.spelling);
        return "/" + pronunciation.trim() + "/";
      } catch (error) {
        console.error(error);
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}