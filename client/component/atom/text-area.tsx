//

import * as react from "react";
import {
  ChangeEvent,
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./text-area.scss"))
export class TextArea extends Component<Props, State> {

  public static defaultProps: Props = {
    value: "",
    font: "normal"
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

  public render(): ReactNode {
    let labelNode;
    if (this.props.label) {
      labelNode = <div styleName="label">{this.props.label}</div>;
    }
    let textAreaStyleNames = ["textarea"];
    if (this.props.font === "monospace") {
      textAreaStyleNames.push("monospace");
    }
    let node = (
      <label styleName="root">
        {labelNode}
        <textarea styleName={textAreaStyleNames.join(" ")} value={this.props.value} onChange={this.handleChange.bind(this)}/>
      </label>
    );
    return node;
  }

}


type Props = {
  value: string,
  label?: string,
  font: "normal" | "monospace",
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void,
  onSet?: (value: string) => void
};
type State = {
};