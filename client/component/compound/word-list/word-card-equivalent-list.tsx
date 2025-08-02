//

import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, aria} from "zographia";
import {create} from "/client/component/create";
import {createTermNode} from "/client/util/dictionary";
import {DictionaryWithExecutors, Section} from "/server/internal/skeleton";


export const WordCardEquivalentList = create(
  require("./word-card-equivalent-list.scss"), "WordCardEquivalentList",
  function ({
    dictionary,
    section,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    section: Section,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const visibleEquivalents = useMemo(() => section.equivalents.filter((equivalent) => !equivalent.hidden), [section.equivalents]);

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
                {createTermNode(equivalent.nameString, equivalent.ignoredPattern)}
              </span>
            </MultiLineText>
          </li>
        ))}
      </div>
    ) : null;

  },
  {memo: true}
);