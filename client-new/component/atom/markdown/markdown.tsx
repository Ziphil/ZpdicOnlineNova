//

import {ReactElement, useCallback} from "react";
import {uriTransformer} from "react-markdown";
import {AdditionalProps, Markdown as ZographiaMarkdown} from "zographia";
import {create} from "/client-new/component/create";
import {MarkdownAnchor} from "./markdown-anchor";


export const Markdown = create(
  require("./markdown.scss"), "Markdown",
  function ({
    mode,
    compact = false,
    homePath,
    children,
    ...rest
  }: {
    mode: "normal" | "document",
    compact?: boolean,
    homePath?: string,
    children: string,
    className?: string
  } & AdditionalProps): ReactElement {

    const transformUrl = useCallback(function (uri: string): string {
      let nextUri = uriTransformer(uri);
      if (homePath !== undefined) {
        nextUri = nextUri.replace(/^~/, homePath);
      }
      if (nextUri === "javascript:void(0)") {
        nextUri = "";
      }
      return nextUri;
    }, [homePath]);

    return (
      <ZographiaMarkdown
        compact={compact}
        disallowedElements={(mode === "normal") ? ["h1", "h2", "h3", "h4", "h5", "h6", "hr"] : ["hr"]}
        components={{a: MarkdownAnchor}}
        transformUrl={transformUrl}
        {...rest}
      >
        {children}
      </ZographiaMarkdown>
    );

  }
);
