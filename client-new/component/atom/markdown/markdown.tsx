//

import {ReactElement} from "react";
import {AdditionalProps, Markdown as ZographiaMarkdown} from "zographia";
import {create} from "/client-new/component/create";
import {MarkdownAnchor} from "./markdown-anchor";


export const Markdown = create(
  require("./markdown.scss"), "Markdown",
  function ({
    mode,
    compact = false,
    children,
    ...rest
  }: {
    mode: "normal" | "document",
    compact?: boolean,
    children: string,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <ZographiaMarkdown
        compact={compact}
        disallowedElements={(mode === "normal") ? ["h1", "h2", "h3", "h4", "h5", "h6"] : null}
        components={{a: MarkdownAnchor}}
        {...rest}
      >
        {children}
      </ZographiaMarkdown>
    );

  }
);
