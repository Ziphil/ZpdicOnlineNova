//

import {ComponentProps, ReactElement, useCallback} from "react";
import {uriTransformer as defaultTransformUri} from "react-markdown";
import {AdditionalProps, Markdown as ZographiaMarkdown} from "zographia";
import {MarkdownHeading} from "/client/component/atom/markdown/markdown-heading";
import {create} from "/client/component/create";
import {remarkCustomSpan} from "/client/util/markdown";
import {MarkdownFeature} from "/server/internal/skeleton";
import {MarkdownAnchor} from "./markdown-anchor";


export const Markdown = create(
  require("./markdown.scss"), "Markdown",
  function ({
    mode,
    compact = false,
    specialPaths,
    components,
    features,
    children,
    ...rest
  }: {
    mode: "normal" | "article" | "document",
    compact?: boolean,
    specialPaths?: MarkdownSpecialPaths,
    components?: ComponentProps<typeof ZographiaMarkdown>["components"],
    features: Array<Omit<MarkdownFeature, "basic">>,
    children: string,
    className?: string
  } & AdditionalProps): ReactElement {

    const transformUrl = useCallback(function (uri: string): string {
      const homePath = specialPaths?.home;
      const atPath = specialPaths?.at;
      let nextUri = defaultTransformUri(uri);
      if (homePath !== undefined) {
        if (typeof homePath === "string") {
          nextUri = nextUri.replace(/^~/, homePath);
        } else {
          if (nextUri.startsWith("~")) {
            nextUri = homePath(nextUri);
          }
        }
      }
      if (atPath !== undefined) {
        if (typeof atPath === "string") {
          nextUri = nextUri.replace(/^@/, atPath);
        } else {
          if (nextUri.startsWith("@")) {
            nextUri = atPath(nextUri);
          }
        }
      }
      if (nextUri === "javascript:void(0)") {
        nextUri = "";
      }
      return nextUri;
    }, [specialPaths?.home, specialPaths?.at]);

    return (
      <ZographiaMarkdown
        compact={compact}
        skipHtml={false}
        disallowedElements={(mode === "normal") ? ["h1", "h2", "h3", "h4", "h5", "h6", "hr"] : ["hr"]}
        components={{
          a: MarkdownAnchor,
          h1: (mode === "article") ? (props) => <MarkdownHeading level={1} {...props}/> : (props) => <h1 {...props}/>,
          h2: (mode === "article") ? (props) => <MarkdownHeading level={2} {...props}/> : (props) => <h2 {...props}/>,
          h3: (mode === "article") ? (props) => <MarkdownHeading level={3} {...props}/> : (props) => <h3 {...props}/>,
          h4: (mode === "article") ? (props) => <MarkdownHeading level={4} {...props}/> : (props) => <h4 {...props}/>,
          h5: (mode === "article") ? (props) => <MarkdownHeading level={5} {...props}/> : (props) => <h5 {...props}/>,
          h6: (mode === "article") ? (props) => <MarkdownHeading level={6} {...props}/> : (props) => <h6 {...props}/>,
          ...components
        }}
        remarkPlugins={[
          ...(features.includes("font") ? [remarkCustomSpan] : [])
        ]}
        transformUrl={transformUrl}
        {...rest}
      >
        {children}
      </ZographiaMarkdown>
    );

  },
  {memo: true}
);


export type MarkdownSpecialPaths = {
  home?: string | ((uri: string) => string),
  at?: string | ((uri: string) => string)
};
