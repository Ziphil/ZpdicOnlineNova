//

import * as react from "react";
import {
  ElementType,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo
} from "react";
import ReactMarkdown from "react-markdown";
import {
  uriTransformer
} from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "/client/component/atom/link";
import {
  create
} from "/client/component/create";


const Markdown = create(
  require("./markdown.scss"), "Markdown",
  function ({
    source,
    type = "normal",
    homePath,
    components,
    className
  }: {
    source: string,
    type?: "simple" | "normal" | "document",
    allowHeading?: boolean,
    homePath?: string,
    components?: MarkdownComponents,
    className?: string
  }): ReactElement {

    let transformUri = useCallback(function (uri: string, children: ReactNode, title: string | null): string {
      let nextUri = uriTransformer(uri);
      if (homePath !== undefined) {
        nextUri = nextUri.replace(/^~/, homePath);
      }
      return nextUri;
    }, [homePath]);

    let [allowedElements, disallowedElements] = useMemo(() => {
      if (type === "simple") {
        let allowedElements = ["p", "a"];
        return [allowedElements, undefined];
      } else if (type === "normal") {
        let disallowedElements = ["hr", "dl", "dd", "dt", "input", "h1", "h2", "h3", "h4", "h5", "h6"];
        return [undefined, disallowedElements];
      } else {
        let disallowedElements = ["hr", "dl", "dd", "dt", "input"];
        return [undefined, disallowedElements];
      }
    }, [type]);
    let customComponents = useMemo(() => {
      if (type === "simple") {
        let renderChildren = function (props: any): ReactElement {
          return props.children;
        };
        return {a: Link, p: renderChildren};
      } else {
        return {a: Link};
      }
    }, [type]);
    let allComponents = {...customComponents, ...components} as MarkdownComponents;
    let innerNode = (
      <ReactMarkdown
        className={className}
        children={source}
        components={allComponents}
        allowedElements={allowedElements}
        disallowedElements={disallowedElements}
        skipHtml={true}
        transformLinkUri={transformUri}
        transformImageUri={transformUri}
        remarkPlugins={[remarkGfm]}
      />
    );
    let node = (type === "simple") ? innerNode : <div styleName="root" className={className}>{innerNode}</div>;
    return node;

  }
);


export type MarkdownComponents = {[type: string]: ElementType};

export default Markdown;