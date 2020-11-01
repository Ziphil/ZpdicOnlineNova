//

import CodeMirror from "codemirror";
import "codemirror/addon/runmode/runmode";
import * as react from "react";
import {
  ReactNode
} from "react";
import {
  findDOMNode
} from "react-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";
import {
  escapeHtml
} from "/client/util/misc";


@style(require("./highlight.scss"))
export default class Highlight extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    value: ""
  };

  public componentDidMount(): void {
    this.drawHighlight();
  }

  private drawHighlight(): void {
    let bindto = findDOMNode(this) as HTMLElement;
    let modeOptions = CodeMirrorUtil.getModeOptions(this.props.mode);
    let html = "";
    html += `<div class=\"cm-s-${escapeHtml(modeOptions.theme)}\">`;
    CodeMirror.runMode(this.props.value, modeOptions.mode, (text, style) => {
      if (text === "\n") {
        html += "<br>";
      } else if (style) {
        html += `<span class="cm-${escapeHtml(style)}">${escapeHtml(text)}</span>`;
      } else {
        html += escapeHtml(text);
      }
    });
    html += "</div>";
    bindto.innerHTML = html;
  }

  public render(): ReactNode {
    let node = (
      <div styleName="root" className={this.props.className}/>
    );
    return node;
  }

}


type Props = {
  value: string,
  mode: string,
  className?: string
};
type DefaultProps = {
  value: string
};
type State = {
};