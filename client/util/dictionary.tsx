//

import {ReactNode} from "react";
import {Dictionary} from "/client/skeleton";


export function getDictionaryIdentifier(dictionary: Dictionary): string | number {
  return dictionary.paramName || dictionary.number;
}

export function createEquivalentNameNode(nameString: string, ignoredPattern: string | undefined): ReactNode {
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