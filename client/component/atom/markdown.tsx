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
import Link from "/client/component/atom/link";
import {
  create
} from "/client/component/create";


const Markdown = create(
  require("./markdown.scss"), "Markdown",
  function ({
    source,
    simple = false,
    allowHeading = false,
    homePath,
    renderers,
    className
  }: {
    source: string,
    simple?: boolean,
    allowHeading?: boolean,
    homePath?: string,
    renderers?: Renderers,
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
      if (simple) {
        let allowedElements = ["root", "text", "paragraph", "link"];
        return [allowedElements, undefined];
      } else {
        let disallowedElements = ["thematicBreak", "definition", "heading", "html", "virtualHtml"];
        if (allowHeading) {
          disallowedElements = disallowedElements.filter((type) => type !== "heading");
        }
        return [undefined, disallowedElements];
      }
    }, [simple, allowHeading]);
    let customRenderers = useMemo(() => {
      if (simple) {
        let simpleRenderer = function (props: any): ReactElement {
          return props.children;
        };
        return {link: Link, root: simpleRenderer, paragraph: simpleRenderer};
      } else {
        return {link: Link};
      }
    }, [simple]);
    let allRenderers = {...customRenderers, ...renderers} as Renderers;
    let innerNode = (
      <ReactMarkdown
        className={className}
        children={source}
        components={allRenderers}
        allowedElements={allowedElements}
        disallowedElements={disallowedElements}
        transformLinkUri={transformUri}
        transformImageUri={transformUri}
      />
    );
    let node = (simple) ? innerNode : <div styleName="root" className={className}>{innerNode}</div>;
    return node;

  }
);


export type Renderers = {[type: string]: ElementType};

export default Markdown;