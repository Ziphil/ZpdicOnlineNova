//

import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DetailedWord, EnhancedDictionary, Word} from "/client/skeleton";


export const WordCardHeading = create(
  require("./word-card-heading.scss"), "WordCardHeading",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    className?: string
  } & AdditionalProps): ReactElement {

    const {transNumber} = useTrans("wordCard");

    const debug = location.hostname === "localhost";
    const pronunciation = useMemo(() => getPronunciation(dictionary, word), [dictionary, word]);

    return (
      <div styleName="root" {...rest}>
        {(debug || word.tags.length > 0) && (
          <div styleName="tag">
            {(debug) && (
              <span styleName="number">#{transNumber(word.number)}</span>
            )}
            {word.tags.map((tag, index) => (
              <Tag key={index} variant="solid">{tag}</Tag>
            ))}
          </div>
        )}
        <div styleName="name-container">
          <MultiLineText styleName="name" is="h3">
            {word.name}
          </MultiLineText>
          {(!!pronunciation) && (
            <div styleName="pronunciation">
              {pronunciation}
            </div>
          )}
        </div>
      </div>
    );

  }
);


function getPronunciation(dictionary: EnhancedDictionary, word: Word | DetailedWord): string | undefined {
  if (!!word.pronunciation) {
    if (word.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
      return word.pronunciation.trim();
    } else {
      return "/" + word.pronunciation.trim() + "/";
    }
  } else {
    if (dictionary.akrantiain !== null) {
      try {
        const pronunciation = dictionary.akrantiain.convert(word.name);
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