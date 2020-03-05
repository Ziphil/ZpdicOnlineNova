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
    type: "text"
  };

  public state: State = {
    value: ""
  };

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let value = event.target.value;
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onValueChange) {
      this.props.onValueChange(value);
    }
  }

  public render(): ReactNode {
    let labelNode;
    if (this.props.label) {
      labelNode = <div styleName="label">{this.props.label}</div>;
    }
    let node = (
      <label styleName="root">
        {labelNode}
        <input styleName="input" type={this.props.type} value={this.state.value} onChange={this.handleChange.bind(this)}/>
      </label>
    );
    return node;
  }

}


type Props = {
  label?: string,
  type: "text" | "password",
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onValueChange?: (value: string) => void
};
type State = {
  value: string
};