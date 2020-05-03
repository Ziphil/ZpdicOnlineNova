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
import {
  createStyleName
} from "/client/util/style-names";


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
    let textAreaStyleName = createStyleName(
      "textarea",
      {if: this.props.font === "monospace", true: "monospace"}
    );
    let labelNode = (this.props.label !== undefined) && <div styleName="label">{this.props.label}</div>;
    let node = (
      <label styleName="root" className={this.props.className}>
        {labelNode}
        <textarea styleName={textAreaStyleName} value={this.props.value} onChange={this.handleChange.bind(this)}/>
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
  onSet?: (value: string) => void,
  className?: string
};
type State = {
};