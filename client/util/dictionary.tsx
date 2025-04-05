//

import {ReactNode} from "react";
import {MarkdownSpecialPaths} from "/client/component/atom/markdown";
import {Dictionary} from "/client/skeleton";
import {getAwsFileUrl} from "/client/util/aws";


export function getDictionaryIdentifier(dictionary: Dictionary): string | number {
  return dictionary.paramName || dictionary.number;
}

export function getDictionarySpecialPaths(dictionary: Dictionary): MarkdownSpecialPaths {
  const specialPaths = {
    home: getAwsFileUrl(`resource/${dictionary.number}/`),
    at: (uri: string) => {
      const name = uri.substring(1);
      return `/dictionary/${getDictionaryIdentifier(dictionary)}?text=${encodeURIComponent(name)}&mode=name&type=exact`;
    }
  };
  return specialPaths;
}

export function createEquivalentNameNode(nameString: string, ignoredPattern: string | undefined): ReactNode {
  if (ignoredPattern) {
    try {
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
    } catch (error) {
      return nameString;
    }
  } else {
    return nameString;
  }
}