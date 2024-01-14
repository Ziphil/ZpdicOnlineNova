//

import {ReactElement} from "react";
import {AdditionalProps, Markdown as ZographiaMarkdown} from "zographia";
import {create} from "/client-new/component/create";
import {MarkdownAnchor} from "./markdown-anchor";


export const Markdown = create(
  require("./markdown.scss"), "Markdown",
  function ({
    mode,
    children,
    ...rest
  }: {
    mode: "normal" | "document",
    children: string,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <ZographiaMarkdown
        disallowedElements={(mode === "normal") ? ["h1", "h2", "h3", "h4", "h5", "h6"] : null}
        components={{a: MarkdownAnchor}}
        {...rest}
      >
        {children}
      </ZographiaMarkdown>
    );

  }
);
