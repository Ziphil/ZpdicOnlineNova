//

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, aria} from "zographia";
import {create} from "/client/component/create";
import {DetailedWord, EnhancedDictionary, Word} from "/client/skeleton";


export const WordCardExampleList = create(
  require("./word-card-example-list.scss"), "WordCardExampleList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    className?: string
  } & AdditionalProps): ReactElement | null {

    return ("examples" in word && word.examples.length > 0) ? (
      <div styleName="root" {...rest}>
        <section>
          <h4 styleName="heading">
            {dictionary.settings.exampleTitle}
          </h4>
          <ul styleName="list">
            {word.examples.map((example, index) => (
              <li styleName="item" key={index}>
                <span styleName="icon" {...aria({hidden: true})}>
                  <FontAwesomeIcon icon={faCaretRight}/>
                </span>
                <MultiLineText styleName="text" is="span">
                  <span>{example.sentence}</span>
                  <span styleName="separator"> — </span>
                  <span>{example.translation}</span>
                </MultiLineText>
              </li>
            ))}
          </ul>
        </section>
      </div>
    ) : null;

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