//

import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, data} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/server/internal/skeleton";


export const WordCardHeading = create(
  require("./word-card-heading.scss"), "WordCardHeading",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const hasFont = dictionary.settings.font.kind === "custom";
    const pronunciation = useMemo(() => getPronunciation(dictionary, word), [dictionary, word]);

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
            {(hasFont) && (
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


function getPronunciation(dictionary: DictionaryWithExecutors, word: Word | WordWithExamples): string | undefined {
  if (!!word.pronunciation) {
    if (word.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
      return word.pronunciation.trim();
    } else {
      return "/" + word.pronunciation.trim() + "/";
    }
  } else {
    if (dictionary.akrantiain !== null) {
      try {
        const pronunciation = dictionary.akrantiain.convert(word.spelling);
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