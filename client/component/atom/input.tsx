//

import * as react from "react";
import {
  ChangeEvent,
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./input.scss"))
export class Input extends Component<Props, State> {

  public static defaultProps: Props = {
    label: "",
    type: "text"
  };

  public state: State = {
    value: ""
  };

  private change(event: ChangeEvent<HTMLInputElement>): void {
    let value = event.target.value;
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  public render(): ReactNode {
    let node = (
      <label styleName="input-wrapper">
        <div styleName="label">{this.props.label}</div>
        <input styleName="input" type={this.props.type} value={this.state.value} onChange={this.change.bind(this)}/>
      </label>
    );
    return node;
  }

}


type Props = {
  label: string,
  type: "text" | "password",
  onChange?: ((value: string) => void)
};
type State = {
  value: string
};