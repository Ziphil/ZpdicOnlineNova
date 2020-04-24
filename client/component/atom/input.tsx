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
    let errorMessage = null;
    let type = this.props.type;
    if (type === "flexible") {
      type = "password";
    }
    this.state = {type, errorMessage};
  }

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let validate = this.props.validate;
    let value = event.target.value;
    if (validate) {
      if (typeof validate === "function") {
        let errorMessage = validate(value);
        this.setState({errorMessage});
      } else {
        let errorMessage = (value.match(validate.regexp)) ? null : validate.message;
        this.setState({errorMessage});
      }
    } else {
      this.setState({errorMessage: null});
    }
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
    let tooltipNode;
    if (this.props.label) {
      labelNode = <div styleName="label">{this.props.label}</div>;
    }
    if (this.props.type === "flexible") {
      let buttonStyleNames = ["button", this.state.type];
      buttonNode = <span styleName={buttonStyleNames.join(" ")} onClick={this.toggleType.bind(this)}/>;
    }
    let inputStyleNames = ["input"];
    if (this.state.errorMessage !== null) {
      let tooltipStyleNames = ["message"];
      if (this.props.usesTooltip) {
        tooltipStyleNames.push("tooltip");
      }
      inputStyleNames.push("error");
      tooltipNode = <div styleName={tooltipStyleNames.join(" ")}>{this.state.errorMessage}</div>;
    }
    let node = (
      <div styleName="root">
        <label styleName="label-wrapper">
          {labelNode}
          <input styleName={inputStyleNames.join(" ")} type={this.state.type} value={this.props.value} onChange={this.handleChange.bind(this)}/>
          {buttonNode}
        </label>
        {tooltipNode}
      </div>
    );
    return node;
  }

}


type Props = {
  value: string,
  label?: string,
  type: "text" | "password" | "flexible",
  validate?: {regexp: RegExp, message: string} | ((value: string) => string | null),
  usesTooltip?: boolean,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: string) => void
};
type State = {
  type: "text" | "password",
  errorMessage: string | null
};