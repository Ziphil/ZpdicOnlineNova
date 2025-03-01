//

import {ReactElement, useCallback} from "react";
import {uriTransformer} from "react-markdown";
import {AdditionalProps, Markdown as ZographiaMarkdown} from "zographia";
import {MarkdownHeading} from "/client/component/atom/markdown/markdown-heading";
import {create} from "/client/component/create";
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
    mode: "normal" | "article" | "document",
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
        skipHtml={false}
        disallowedElements={(mode === "normal") ? ["h1", "h2", "h3", "h4", "h5", "h6", "hr"] : ["hr"]}
        components={{
          a: MarkdownAnchor,
          h1: (mode === "article") ? (props) => <MarkdownHeading level={1} {...props}/> : undefined,
          h2: (mode === "article") ? (props) => <MarkdownHeading level={2} {...props}/> : undefined,
          h3: (mode === "article") ? (props) => <MarkdownHeading level={3} {...props}/> : undefined,
          h4: (mode === "article") ? (props) => <MarkdownHeading level={4} {...props}/> : undefined,
          h5: (mode === "article") ? (props) => <MarkdownHeading level={5} {...props}/> : undefined,
          h6: (mode === "article") ? (props) => <MarkdownHeading level={6} {...props}/> : undefined
        }}
        transformUrl={transformUrl}
        {...rest}
      >
        {children}
      </ZographiaMarkdown>
    );

  }
);
