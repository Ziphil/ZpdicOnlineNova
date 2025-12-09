//

import type {Content, Parent, Root} from "mdast";
import type {Data, Node} from "unist";
import {CONTINUE, SKIP, visit} from "unist-util-visit";


export function remarkCustomSpan(): (tree: Root) => void {
  const plugin = function (tree: Root): void {
    visit(tree, (node) => {
      if ("type" in node && node.type as string === "customSpan") {
        return SKIP;
      } else {
        if (isParent(node)) {
          node.children = wrapCustomSpan(node.children);
        }
        return CONTINUE;
      }
    });
  };
  return plugin;
}

function wrapCustomSpan(children: Array<Content>): Array<Content> {
  const headChildren = [] as Array<Content>;
  let inside = false;
  let capturedContents = [] as Array<Content>;
  for (const child of children) {
    if (child.type === "text") {
      const value = child.value ?? "";
      let start = 0;
      for (let pos = 0; pos < value.length; pos += 1) {
        const char = value.charAt(pos);
        if (!inside) {
          if (char === "{") {
            const before = value.slice(start, pos);
            if (before.length > 0) {
              headChildren.push({type: "text", value: before});
            }
            inside = true;
            capturedContents = [];
            start = pos + 1;
          }
        } else {
          if (char === "}") {
            const part = value.slice(start, pos);
            if (part.length > 0) {
              capturedContents.push({type: "text", value: part});
            }
            const customSpan = {
              type: "customSpan",
              data: {hName: "span", hProperties: {className: ["custom"]}} as Data,
              children: capturedContents
            } as unknown as Content;
            headChildren.push(customSpan);
            capturedContents = [];
            inside = false;
            start = pos + 1;
          }
        }
      }
      const rest = value.slice(start);
      if (rest.length > 0) {
        if (!inside) {
          headChildren.push({type: "text", value: rest});
        } else {
          capturedContents.push({type: "text", value: rest});
        }
      }
    } else {
      if (!inside) {
        headChildren.push(child);
      } else {
        capturedContents.push(child);
      }
    }
  }
  if (inside) {
    headChildren.push({type: "text", value: "{"});
    for (const content of capturedContents) {
      headChildren.push(content);
    }
    inside = false;
    capturedContents = [];
  }
  return headChildren;
}

function isParent(node: Node): node is Parent {
  return "children" in node && Array.isArray(node.children);
}