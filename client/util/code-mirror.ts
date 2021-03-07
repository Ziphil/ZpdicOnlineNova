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
    {regex: /\+|\*|\?=?/, token: "operator"}
  ]
});

CodeMirror.defineSimpleMode("cddl", {
  start: [
    {regex: /"([^"\\]|\\.)*?"/, token: "string"},
    {regex: /'([^'\\]|\\.)*?'/, token: "string"},
    {regex: /;.*$/, token: "comment"},
    {regex: /bool|(u|n)?int|float(16|32|64)?|(b|t)str|bytes|text|any/, token: "keyword"},
    {regex: /[0-9]+/, token: "number"},
    {regex: /[a-zA-Z_-][a-zA-Z0-9_-]*/, token: "variable-1"},
    {regex: /\+|\*|\?=?/, token: "operator"}
  ]
});

CodeMirror.defineSimpleMode("regexp", {
  start: [
    {regex: /\[/, token: "variable-1", next: "characterClass"},
    {regex: /\\./, token: "keyword"},
    {regex: /\.|\^|\$/, token: "operator"},
    {regex: /\+|\*|\?|\|/, token: "operator"},
    {regex: /\{\d+(,\d*)?\}/, token: "operator"},
    {regex: /\(|\)/, token: "bracket"}
  ],
  characterClass: [
    {regex: /\\./, token: "keyword"},
    {regex: /[^\\\]]+/, token: "variable-1"},
    {regex: /\]/, token: "variable-1", next: "start"}
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
    } else if (language === "cddl") {
      return {theme: "zpcddl", mode: {name: "cddl"}};
    } else if (language === "regexp") {
      return {theme: "zpregexp", mode: {name: "regexp"}};
    } else {
      return {theme: "zpplain", mode: undefined};
    }
  }

}