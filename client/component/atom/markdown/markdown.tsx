//

import {ComponentProps, HTMLAttributes, ReactElement, createElement, useCallback, useMemo} from "react";
import {uriTransformer as defaultTransformUri} from "react-markdown";
import remarkSupsub from "remark-supersub";
import type {Pluggable} from "unified";
import {AdditionalProps, Markdown as ZographiaMarkdown} from "zographia";
import {MarkdownHeading} from "/client/component/atom/markdown/markdown-heading";
import {create} from "/client/component/create";
import {remarkCustomFont} from "/client/util/markdown";
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
      return getModifiedUri(uri, specialPaths);
    }, [specialPaths]);

    const [rehypePlugins, remarkPlugins] = useMemo(() => getAllFeaturePlugins(features), [features]);

    return (
      <ZographiaMarkdown
        compact={compact}
        skipHtml={false}
        disallowedElements={(mode === "normal") ? ["h1", "h2", "h3", "h4", "h5", "h6", "hr"] : ["hr"]}
        components={{
          a: MarkdownAnchor,
          h1: createHeadingComponent(mode, 1),
          h2: createHeadingComponent(mode, 2),
          h3: createHeadingComponent(mode, 3),
          h4: createHeadingComponent(mode, 4),
          h5: createHeadingComponent(mode, 5),
          h6: createHeadingComponent(mode, 6),
          ...components
        }}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        transformUrl={transformUrl}
        {...rest}
      >
        {children}
      </ZographiaMarkdown>
    );

  },
  {memo: true}
);


function getModifiedUri(uri: string, specialPaths?: MarkdownSpecialPaths): string {
  const homePath = specialPaths?.home;
  const atPath = specialPaths?.at;
  let nextUri = decodeUri(defaultTransformUri(uri));
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
}

export function decodeUri(uri: string): string {
  if (uri.startsWith("@")) {
    if (!uri.includes("%")) {
      return uri;
    } else {
      try {
        return decodeURIComponent(uri);
      } catch {
        return uri;
      }
    }
  } else if (uri.startsWith("%40")) {
    try {
      const decodedUri = decodeURIComponent(uri);
      return (decodedUri.startsWith("@")) ? decodedUri : uri;
    } catch {
      return uri;
    }
  } else {
    return uri;
  }
}

function getFeaturePlugins(feature: Omit<MarkdownFeature, "basic">): [rehypePlugins: Array<Pluggable>, remarkPlugins: Array<Pluggable>] {
  if (feature === "supsub") {
    return [[], [remarkSupsub]];
  } else if (feature === "font") {
    return [[], [remarkCustomFont]];
  } else {
    return [[], []];
  }
}

function getAllFeaturePlugins(features: Array<Omit<MarkdownFeature, "basic">>): [rehypePlugins: Array<Pluggable>, remarkPlugins: Array<Pluggable>] {
  return features.reduce<[Array<Pluggable>, Array<Pluggable>]>(([accumRehypePlugins, accumRemarkPlugins], feature) => {
    const [rehypePlugins, remarkPlugins] = getFeaturePlugins(feature);
    return [[...accumRehypePlugins, ...rehypePlugins], [...accumRemarkPlugins, ...remarkPlugins]];
  }, [[], []]);
}

function createHeadingComponent(mode: "normal" | "article" | "document", level: 1 | 2 | 3 | 4 | 5 | 6): any {
  if (mode === "article") {
    const component = function (props: HTMLAttributes<HTMLHeadingElement>): ReactElement {
      return <MarkdownHeading level={level} {...props}/>;
    };
    return component;
  } else {
    const component = function (props: HTMLAttributes<HTMLHeadingElement>): ReactElement {
      return createElement(`h${level}`, props);
    };
    return component;
  }
}

export type MarkdownSpecialPaths = {
  home?: string | ((uri: string) => string),
  at?: string | ((uri: string) => string)
};
