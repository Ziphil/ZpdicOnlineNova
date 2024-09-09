//

import {ReactElement, ReactNode} from "react";
import {AdditionalProps, MultiLineText, Tag} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";


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

    return (word.equivalents.length > 0) ? (
      <div styleName="root" {...rest}>
        {word.equivalents.map((equivalent, index) => (
          <MultiLineText styleName="text" key={index} is="div">
            {equivalent.titles.map((title, index) => (!!title) && (
              <Tag key={index} styleName="tag" variant="light">{title}</Tag>
            ))}
            <span>
              {createNameNode(equivalent.nameString, equivalent.ignoredPattern)}
            </span>
          </MultiLineText>
        ))}
      </div>
    ) : null;

  }
);


function createNameNode(nameString: string, ignoredPattern: string | undefined): ReactNode {
  if (ignoredPattern) {
    const regexp = new RegExp(ignoredPattern, "g");
    const nodes = [];
    let index = 0;
    let match;
    while ((match = regexp.exec(nameString)) !== null) {
      nodes.push(<span key={nodes.length}>{nameString.substring(index, match.index)}</span>);
      nodes.push(<span styleName="ignored" key={nodes.length}>{match[0]}</span>);
      index = match.index + match[0].length;
    }
    nodes.push(<span key={nodes.length}>{nameString.substring(index)}</span>);
    return nodes;
  } else {
    return nameString;
  }
}