//

import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, aria} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, TemplateWord, Word, WordWithExamples} from "/client/skeleton";
import {createEquivalentNameNode} from "/client/util/dictionary";


export const WordCardEquivalentList = create(
  require("./word-card-equivalent-list.scss"), "WordCardEquivalentList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | TemplateWord | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    return (word.equivalents.length > 0) ? (
      <div styleName="root" {...rest}>
        {word.equivalents.map((equivalent, index) => (
          <li styleName="item" key={index}>
            {(dictionary.settings.showEquivalentNumber) && (
              <span styleName="number" {...aria({hidden: true})}>
                {index + 1}
              </span>
            )}
            <MultiLineText styleName="text" is="div">
              {equivalent.titles.map((title, index) => (!!title) && (
                <Tag key={index} styleName="tag" variant="light">{title}</Tag>
              ))}
              <span>
                {useMemo(() => createEquivalentNameNode(equivalent.nameString, equivalent.ignoredPattern), [equivalent.nameString, equivalent.ignoredPattern])}
              </span>
            </MultiLineText>
          </li>
        ))}
      </div>
    ) : null;

  }
);