//

import CodeMirror from "codemirror";
import "codemirror/addon/runmode/runmode";
import * as react from "react";
import {
  ReactElement,
  useCallback,
  useEffect,
  useRef
} from "react";
import {
  create
} from "/client/component/create";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";
import {
  escapeHtml
} from "/client/util/misc";


const Highlight = create(
  require("./highlight.scss"), "Highlight",
  function ({
    source = "",
    language,
    className
  }: {
    source?: string,
    language: string,
    className?: string
  }): ReactElement {

    let rootRef = useRef<HTMLDivElement>(null);

    let drawHighlight = useCallback(function (): void {
      if (rootRef.current !== null) {
        let modeOptions = CodeMirrorUtil.getModeOptions(language);
        let html = "";
        html += `<div class=\"cm-s-${escapeHtml(modeOptions.theme)}\">`;
        CodeMirror.runMode(source, modeOptions.mode, (text, style) => {
          if (text === "\n") {
            html += "<br>";
          } else if (style) {
            html += `<span class="cm-${escapeHtml(style)}">${escapeHtml(text)}</span>`;
          } else {
            html += escapeHtml(text);
          }
        });
        html += "</div>";
        rootRef.current.innerHTML = html;
      }
    }, [language, source]);

    useEffect(() => {
      drawHighlight();
    }, [rootRef]);

    let node = (
      <div styleName="root" className={className} ref={rootRef}/>
    );
    return node;

  }
);


export default Highlight;