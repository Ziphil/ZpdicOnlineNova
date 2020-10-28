//

import "akrantiain/dist/code-mirror/mode";
import "codemirror/mode/markdown/markdown";
import * as react from "react";
import {
  ChangeEvent,
  ReactNode
} from "react";
import {
  Controlled as CodeMirror
} from "react-codemirror2";
import "zatlin/dist/code-mirror/mode";
import Label from "/client/component/atom/label";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./text-area.scss"))
export default class TextArea extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    value: "",
    font: "normal",
    nowrap: false,
    readOnly: false
  };

  private handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    let value = event.target.value;
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  private handleBeforeChange(editor: any, data: any, value: string): void {
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  public render(): ReactNode {
    let styles = this.props.styles!;
    let textAreaNode = (() => {
      if (this.props.mode !== undefined) {
        let individualOptions = (() => {
          if (this.props.mode === "markdown") {
            return {theme: "zpmarkdown", mode: {name: "markdown", xml: false, fencedCodeBlockHighlighting: false}};
          } else if (this.props.mode === "akrantiain") {
            return {theme: "zpakrantiain", mode: {name: "akrantiain"}};
          } else if (this.props.mode === "zatlin") {
            return {theme: "zpakrantiain", mode: {name: "zatlin"}};
          }
        })();
        let options = {...individualOptions, readOnly: this.props.readOnly, lineWrapping: !this.props.nowrap};
        let textAreaNode = (
          <CodeMirror className={styles["textarea-code"]} value={this.props.value} options={options} onBeforeChange={this.handleBeforeChange.bind(this)}/>
        );
        return textAreaNode;
      } else {
        let textAreaStyleName = StyleNameUtil.create(
          "textarea",
          {if: this.props.font === "monospace", true: "monospace"},
          {if: this.props.nowrap, true: "nowrap"}
        );
        let textAreaNode = <textarea styleName={textAreaStyleName} value={this.props.value} readOnly={this.props.readOnly} onChange={this.handleChange.bind(this)}/>;
        return textAreaNode;
      }
    })();
    let node = (
      <label styleName="root" className={this.props.className}>
        <Label text={this.props.label} showRequired={this.props.showRequired} showOptional={this.props.showOptional}/>
        {textAreaNode}
      </label>
    );
    return node;
  }

}


type Props = {
  value: string,
  label?: string,
  font: "normal" | "monospace",
  mode?: "markdown" | "akrantiain" | "zatlin",
  nowrap: boolean,
  readOnly: boolean,
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
  readOnly: boolean
};
type State = {
};