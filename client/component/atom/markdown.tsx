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
  NodeType
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

    let transformUri = useCallback(function (uri: string, children?: ReactNode, title?: string): string {
      let nextUri = ReactMarkdown.uriTransformer(uri);
      if (homePath !== undefined) {
        nextUri = nextUri.replace(/^~/, homePath);
      }
      return nextUri;
    }, [homePath]);

    let [allowedTypes, disallowedTypes] = useMemo(() => {
      if (simple) {
        let allowedTypes = ["root", "text", "paragraph", "link"] as Array<NodeType>;
        return [allowedTypes, undefined];
      } else {
        let disallowedTypes = ["thematicBreak", "definition", "heading", "html", "virtualHtml"] as Array<NodeType>;
        if (allowHeading) {
          disallowedTypes = disallowedTypes.filter((type) => type !== "heading");
        }
        return [undefined, disallowedTypes];
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
        source={source}
        renderers={allRenderers}
        allowedTypes={allowedTypes}
        disallowedTypes={disallowedTypes}
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