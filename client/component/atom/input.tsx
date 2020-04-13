//

import * as react from "react";
import {
  ChangeEvent,
  MouseEvent,
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./input.scss"))
export class Input extends Component<Props, State> {

  public static defaultProps: Props = {
    value: "",
    type: "text"
  };

  public constructor(props: any) {
    super(props);
    let type = this.props.type;
    if (type === "flexible") {
      type = "password";
    }
    this.state = {type};
  }

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let value = event.target.value;
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
        <input styleName="input" type={this.state.type} value={this.props.value} onChange={this.handleChange.bind(this)}/>
        {buttonNode}
      </label>
    );
    return node;
  }

}


type Props = {
  value: string,
  label?: string,
  type: "text" | "password" | "flexible",
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: string) => void
};
type State = {
  type: "text" | "password"
};