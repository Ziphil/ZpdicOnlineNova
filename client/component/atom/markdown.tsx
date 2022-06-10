//

import * as react from "react";
import {
  ElementType,
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo
} from "react";
import ReactMarkdown from "react-markdown";
import {
  Options as ReactMarkdownOptions
} from "react-markdown";
import {
  uriTransformer
} from "react-markdown";
import {
  ElementContent
} from "react-markdown/lib/ast-to-react";
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
    components?: ReactMarkdownOptions["components"],
    className?: string
  }): ReactElement {

    let transformLinkUri = useCallback(function (uri: string, children: Array<ElementContent>, title: string | null): string {
      let nextUri = uriTransformer(uri);
      if (homePath !== undefined) {
        nextUri = nextUri.replace(/^~/, homePath);
      }
      if (nextUri === "javascript:void(0)") {
        nextUri = "";
      }
      return nextUri;
    }, [homePath]);

    let transformImageUri = useCallback(function (uri: string, alt: string, title: string | null): string {
      let nextUri = uriTransformer(uri);
      if (homePath !== undefined) {
        nextUri = nextUri.replace(/^~/, homePath);
      }
      if (nextUri === "javascript:void(0)") {
        nextUri = "";
      }
      return nextUri;
    }, [homePath]);

    let [allowedElements, disallowedElements] = useMemo(() => {
      if (type === "simple") {
        return [["p", "a"], undefined];
      } else if (type === "normal") {
        return [undefined, ["hr", "dl", "dd", "dt", "input", "h1", "h2", "h3", "h4", "h5", "h6"]];
      } else {
        return [undefined, ["hr", "dl", "dd", "dt", "input"]];
      }
    }, [type]);
    let customComponents = (type === "simple") ? {a: Link, p: MarkdownSimple} : {a: Link};
    let allComponents = {...customComponents, ...components} as any;
    let innerNode = (
      <ReactMarkdown
        className={className}
        children={source}
        components={allComponents}
        allowedElements={allowedElements}
        disallowedElements={disallowedElements}
        skipHtml={true}
        transformLinkUri={transformLinkUri}
        transformImageUri={transformImageUri}
        remarkPlugins={[remarkGfm]}
      />
    );
    let node = (type === "simple") ? innerNode : <div styleName="root" className={className}>{innerNode}</div>;
    return node;

  }
);


const MarkdownSimple = create(
  null,
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement {

    let node = (
      <Fragment>
        {children}
      </Fragment>
    );
    return node;

  }
);


export default Markdown;