//

import CodeMirror from "codemirror";
import "codemirror/addon/mode/simple";


require("akrantiain/dist/code-mirror/mode");
require("zatlin/dist/code-mirror/mode");
require("codemirror/mode/markdown/markdown");

CodeMirror.defineSimpleMode("bnf", {
  start: [
    {regex: /"([^"\\]|\\.)*?"/, token: "string"},
    {regex: /'([^'\\]|\\.)*?'/, token: "string"},
    {regex: /\[([^\[\]\\]|\\.)*?\]/, token: "string"},
    {regex: /[a-zA-Z][a-zA-Z0-9_]*/, token: "variable-1"},
    {regex: /(\+|\*|\?=?)/, token: "operator"}
  ]
});


export class CodeMirrorUtil {

  public static getModeOptions(language: string): {theme: string, mode: any} {
    if (language === "akrantiain") {
      return {theme: "zpakrantiain", mode: {name: "akrantiain"}};
    } else if (language === "zatlin") {
      return {theme: "zpakrantiain", mode: {name: "zatlin"}};
    } else if (language === "markdown") {
      return {theme: "zpmarkdown", mode: {name: "markdown", xml: false, fencedCodeBlockHighlighting: false}};
    } else if (language === "bnf") {
      return {theme: "zpbnf", mode: {name: "bnf"}};
    } else {
      return {theme: "zpplain", mode: undefined};
    }
  }

}