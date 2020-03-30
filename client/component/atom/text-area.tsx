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
    font: "normal"
  };

  public constructor(props: any) {
    super(props);
    let value = "";
    if (this.props.initialValue !== undefined) {
      value = this.props.initialValue;
    }
    this.state = {value};
  }

  private handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    let value = event.target.value;
    this.setState({value});
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
        <textarea styleName={textAreaStyleNames.join(" ")} value={this.state.value} onChange={this.handleChange.bind(this)}/>
      </label>
    );
    return node;
  }

}


type Props = {
  label?: string,
  font: "normal" | "monospace",
  initialValue?: string,
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void,
  onSet?: (value: string) => void
};
type State = {
  value: string
};