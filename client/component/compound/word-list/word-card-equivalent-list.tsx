//

import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, aria} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";
import {createEquivalentNameNode} from "/client/util/dictionary";


export const WordCardEquivalentList = create(
  require("./word-card-equivalent-list.scss"), "WordCardEquivalentList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const visibleEquivalents = useMemo(() => word.equivalents.filter((equivalent) => !equivalent.hidden), [word.equivalents]);

    return (visibleEquivalents.length > 0) ? (
      <div styleName="root" {...rest}>
        {visibleEquivalents.map((equivalent, index) => (
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
                {createEquivalentNameNode(equivalent.nameString, ("ignoredPattern" in equivalent) ? equivalent.ignoredPattern : dictionary.settings.ignoredEquivalentPattern)}
              </span>
            </MultiLineText>
          </li>
        ))}
      </div>
    ) : null;

  }
);