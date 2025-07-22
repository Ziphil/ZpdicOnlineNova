//

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, Tag, aria} from "zographia";
import {create} from "/client/component/create";
import {createTermNode} from "/client/util/dictionary";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/server/internal/skeleton";


export const WordCardPhraseList = create(
  require("./word-card-phrase-list.scss"), "WordCardPhraseList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    return (word.phrases.length > 0) ? (
      <div styleName="root" {...rest}>
        <section>
          <h4 styleName="heading">
            {dictionary.settings.phraseTitle}
          </h4>
          <ul styleName="list">
            {word.phrases.map((phrase, index) => (
              <li styleName="item" key={index}>
                <span styleName="icon" {...aria({hidden: true})}>
                  <FontAwesomeIcon icon={faCaretRight}/>
                </span>
                <MultiLineText styleName="text" is="span">
                  {phrase.titles.map((title, index) => (!!title) && (
                    <Tag key={index} styleName="tag" variant="light">{title}</Tag>
                  ))}
                  <span>
                    {phrase.form}
                  </span>
                  <span styleName="separator" {...aria({hidden: true})}/>
                  <span>
                    {createTermNode(phrase.termString, phrase.ignoredPattern)}
                  </span>
                </MultiLineText>
              </li>
            ))}
          </ul>
        </section>
      </div>
    ) : null;

  }
);