//

import {RE2JS as Re2} from "re2js";
import {ReactNode} from "react";
import {MarkdownSpecialPaths} from "/client/component/atom/markdown";
import {getAwsFileUrl} from "/client/util/aws";
import {Dictionary} from "/server/internal/skeleton";


export function getDictionaryIdentifier(dictionary: Dictionary): string | number {
  return dictionary.paramName || dictionary.number;
}

export function getDictionarySpecialPaths(dictionary: Dictionary): MarkdownSpecialPaths {
  const specialPaths = {
    home: getAwsFileUrl(`resource/${dictionary.number}/`),
    at: (uri: string) => {
      const name = uri.substring(1);
      if (name.startsWith("#")) {
        const number = name.substring(1);
        return `/dictionary/${getDictionaryIdentifier(dictionary)}?kind=exact&number=${number}`;
      } else {
        return `/dictionary/${getDictionaryIdentifier(dictionary)}?text=${encodeURIComponent(name)}&mode=name&type=exact`;
      }
    }
  };
  return specialPaths;
}

export function getWordHref(dictionary: Dictionary, number: number): string {
  return `/dictionary/${getDictionaryIdentifier(dictionary)}?kind=exact&number=${number}`;
}

export function checkWordHref(dictionary: Dictionary, href: string): number | undefined {
  const match = href.match(/^\/dictionary\/(.+)\?kind=exact&number=(\d+)$/);
  if (match) {
    if (match[1] === dictionary.paramName || match[1] === dictionary.number.toString()) {
      return +match[2];
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export function getExampleHref(dictionary: Dictionary, number: number): string {
  return `/dictionary/${getDictionaryIdentifier(dictionary)}/sentences?kind=exact&number=${number}`;
}

export function createEquivalentNameNode(nameString: string, ignoredPattern: string | undefined): ReactNode {
  if (ignoredPattern) {
    try {
      const regexp = Re2.compile(ignoredPattern);
      const matcher = regexp.matcher(nameString);
      const nodes = [];
      let index = 0;
      let matchCount = 0;
      while (matcher.find() && matchCount < 100) {
        nodes.push(<span key={nodes.length}>{nameString.substring(index, +matcher.start())}</span>);
        nodes.push(<span styleName="ignored" key={nodes.length}>{nameString.substring(+matcher.start(), +matcher.end())}</span>);
        index = +matcher.end();
        matchCount ++;
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