//

import * as react from "react";
import {
  ChangeEvent,
  Component,
  MouseEvent,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./input.scss"))
export class Input extends Component<Props, State> {

  public static defaultProps: Props = {
    type: "text"
  };

  public constructor(props: Props) {
    super(props);
    let value = "";
    let type = this.props.type;
    if (this.props.initialValue !== undefined) {
      value = this.props.initialValue;
    }
    if (type === "flexible") {
      type = "password";
    }
    this.state = {value, type};
  }

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let value = event.target.value;
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  private toggleType(event: MouseEvent<HTMLSpanElement>): void {
    if (this.state.type === "text") {
      this.setState({type: "password"});
    } else {
      this.setState({type: "text"});
    }
  }

  public render(): ReactNode {
    let labelNode;
    let buttonNode;
    if (this.props.label) {
      labelNode = <div styleName="label">{this.props.label}</div>;
    }
    if (this.props.type === "flexible") {
      let buttonStyleNames = ["button", this.state.type];
      buttonNode = <span styleName={buttonStyleNames.join(" ")} onClick={this.toggleType.bind(this)}/>;
    }
    let node = (
      <label styleName="root">
        {labelNode}
        <input styleName="input" type={this.state.type} value={this.state.value} onChange={this.handleChange.bind(this)}/>
        {buttonNode}
      </label>
    );
    return node;
  }

}


type Props = {
  label?: string,
  type: "text" | "password" | "flexible",
  initialValue?: string,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: string) => void
};
type State = {
  value: string,
  type: "text" | "password"
};