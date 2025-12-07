//

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, Tag, aria} from "zographia";
import {Markdown} from "/client/component/atom/markdown";
import {WordCardAnchor} from "/client/component/compound/word-list/word-card-anchor";
import {create} from "/client/component/create";
import {createTermNode, getDictionarySpecialPaths} from "/client/util/dictionary";
import {DictionaryWithExecutors, Section} from "/server/internal/skeleton";


export const WordCardPhraseList = create(
  require("./word-card-phrase-list.scss"), "WordCardPhraseList",
  function ({
    dictionary,
    section,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    section: Section,
    className?: string
  } & AdditionalProps): ReactElement | null {

    return (section.phrases.length > 0) ? (
      <div styleName="root" {...rest}>
        <section>
          <h4 styleName="heading">
            {dictionary.settings.phraseTitle}
          </h4>
          <ul styleName="list">
            {section.phrases.map((phrase, index) => (
              <li styleName="item" key={index}>
                <span styleName="icon" {...aria({hidden: true})}>
                  <FontAwesomeIcon icon={faCaretRight}/>
                </span>
                <div styleName="text-container">
                  <MultiLineText styleName="expression" is="span">
                    {phrase.titles.map((title, index) => (!!title) && (
                      <Tag key={index} styleName="tag" variant="light" scheme="gray">{title}</Tag>
                    ))}
                    <span>
                      {phrase.expression}
                    </span>
                    <span styleName="separator" {...aria({hidden: true})}/>
                    <span>
                      {createTermNode(phrase.termString, phrase.ignoredPattern)}
                    </span>
                  </MultiLineText>
                  {(!!phrase.text) && (
                    (dictionary.settings.enableMarkdown) ? (
                      <Markdown
                        styleName="markdown"
                        mode="normal"
                        compact={true}
                        specialPaths={getDictionarySpecialPaths(dictionary)}
                        components={{
                          a: (props) => <WordCardAnchor dictionary={dictionary} {...props}/>
                        }}
                      >
                        {phrase.text}
                      </Markdown>
                    ) : (
                      <MultiLineText styleName="text">
                        {phrase.text}
                      </MultiLineText>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    ) : null;

  },
  {memo: true}
);