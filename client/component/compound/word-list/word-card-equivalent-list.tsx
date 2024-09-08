//

import {ReactElement, ReactNode} from "react";
import {AdditionalProps, MultiLineText, Tag} from "zographia";
import {create} from "/client/component/create";
import {Dictionary, DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";


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
              {createNameNode(dictionary, equivalent.nameString)}
            </span>
          </MultiLineText>
        ))}
      </div>
    ) : null;

  }
);


function createNameNode(dictionary: Dictionary, nameString: string): ReactNode {
  if (dictionary.settings.enableMarkdown) {
    const regexp = new RegExp(dictionary.settings.ignoredEquivalentPattern || "", "g");
    const nodes = [];
    let lastIndex = 0;
    let match;
    while ((match = regexp.exec(nameString)) !== null) {
      nodes.push(<span key={nodes.length}>{nameString.substring(lastIndex, match.index)}</span>);
      nodes.push(<span styleName="ignored" key={nodes.length}>{match[0]}</span>);
      lastIndex = match.index + match[0].length;
    }
    nodes.push(<span key={nodes.length}>{nameString.substring(lastIndex)}</span>);
    return nodes;
  } else {
    return nameString;
  }
}