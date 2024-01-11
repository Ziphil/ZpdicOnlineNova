//

import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, Tag} from "zographia";
import {DetailedWord, Word} from "/client/skeleton/dictionary";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";


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

    return (
      <div styleName="root" {...rest}>
        <div styleName="name-container">
          <MultiLineText styleName="name" is="h3">
            {word.name}
          </MultiLineText>
          <div styleName="pronunciation">
            {getPronunciation(dictionary, word)}
          </div>
        </div>
        {(word.tags.length > 0) && (
          <div styleName="tag">
            {word.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    );

  }
);


function getPronunciation(dictionary: EnhancedDictionary, word: Word | DetailedWord): string | undefined {
  if (word.pronunciation !== undefined) {
    if (word.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
      return word.pronunciation;
    } else {
      return "/" + word.pronunciation + "/";
    }
  } else {
    if (dictionary.akrantiain !== null) {
      try {
        const pronunciation = dictionary.akrantiain.convert(word.name);
        return "/" + pronunciation + "/";
      } catch (error) {
        console.error(error);
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}