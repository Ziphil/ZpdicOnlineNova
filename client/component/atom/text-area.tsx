//

import * as react from "react";
import {
  ChangeEvent,
  ReactNode
} from "react";
import {
  Controlled as CodeMirror
} from "react-codemirror2";
import Label from "/client/component/atom/label";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  CodeMirrorUtil
} from "/client/util/code-mirror";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./text-area.scss"))
export default class TextArea extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    value: "",
    font: "normal",
    nowrap: false,
    readOnly: false,
    fitHeight: false
  };

  private handleBeforeChange(editor: any, data: any, value: string): void {
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  private handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    let value = event.target.value;
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  private renderCodeMirror(): ReactNode {
    let styles = this.props.styles!;
    let className = StyleNameUtil.create(
      styles["textarea-code"],
      {if: this.props.fitHeight, true: styles["fit"], false: styles["no-fit"]}
    );
    let modeOptions = CodeMirrorUtil.getModeOptions(this.props.language!);
    let heightOptions = (this.props.fitHeight) ? {viewportMargin: 1 / 0} : {};
    let otherOptions = {readOnly: this.props.readOnly, lineWrapping: !this.props.nowrap};
    let options = {...modeOptions, ...heightOptions, ...otherOptions};
    let node = (
      <CodeMirror className={className} value={this.props.value} options={options} onBeforeChange={this.handleBeforeChange.bind(this)}/>
    );
    return node;
  }

  private renderTextArea(): ReactNode {
    let styleName = StyleNameUtil.create(
      "textarea",
      {if: this.props.font === "monospace", true: "monospace"},
      {if: this.props.nowrap, true: "nowrap"}
    );
    let node = (
      <textarea styleName={styleName} value={this.props.value} readOnly={this.props.readOnly} onChange={this.handleChange.bind(this)}/>
    );
    return node;
  }

  public render(): ReactNode {
    let innerNode = (this.props.language !== undefined) ? this.renderCodeMirror() : this.renderTextArea();
    let node = (
      <label styleName="root" className={this.props.className}>
        <Label text={this.props.label} showRequired={this.props.showRequired} showOptional={this.props.showOptional}/>
        {innerNode}
      </label>
    );
    return node;
  }

}


type Props = {
  value: string,
  label?: string,
  font: "normal" | "monospace",
  language?: string,
  nowrap: boolean,
  readOnly: boolean,
  fitHeight: boolean,
  showRequired?: boolean,
  showOptional?: boolean,
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void,
  onSet?: (value: string) => void,
  className?: string
};
type DefaultProps = {
  value: string,
  font: "normal" | "monospace",
  nowrap: boolean,
  readOnly: boolean,
  fitHeight: boolean
};
type State = {
};