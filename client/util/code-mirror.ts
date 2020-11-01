//


require("akrantiain/dist/code-mirror/mode");
require("zatlin/dist/code-mirror/mode");
require("codemirror/mode/markdown/markdown");


export class CodeMirrorUtil {

  public static getModeOptions(language: string): {theme: string, mode: any} {
    if (language === "markdown") {
      return {theme: "zpmarkdown", mode: {name: "markdown", xml: false, fencedCodeBlockHighlighting: false}};
    } else if (language === "akrantiain") {
      return {theme: "zpakrantiain", mode: {name: "akrantiain"}};
    } else if (language === "zatlin") {
      return {theme: "zpakrantiain", mode: {name: "zatlin"}};
    } else {
      return {theme: "zpplain", mode: undefined};
    }
  }

}