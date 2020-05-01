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
import {
  createStyleName
} from "/client/util/style-names";


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
    let inputStyleName = createStyleName(
      "input",
      {if: this.state.errorMessage !== null, true: "error"}
    );
    let labelNode = (this.props.label !== undefined) && (() => {
      let labelStyleName = createStyleName(
        "label",
        {if: this.state.errorMessage !== null, true: "error"}
      );
      return <div styleName={labelStyleName}>{this.props.label}</div>;
    })();
    let buttonNode = (this.props.type === "flexible") && (() => {
      let buttonStyleName = createStyleName("button", this.state.type);
      return <span styleName={buttonStyleName} onClick={this.toggleType.bind(this)}/>;
    })();
    let tooltipNode = (this.state.errorMessage !== null) && (
      <div styleName="tooltip">{this.state.errorMessage}</div>
    );
    let node = (
      <div styleName="root" className={this.props.className}>
        <label styleName="label-wrapper">
          {labelNode}
          <input styleName={inputStyleName} type={this.state.type} value={this.props.value} onChange={this.handleChange.bind(this)}/>
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
  onSet?: (value: string) => void,
  className?: string
};
type State = {
  type: "text" | "password",
  errorMessage: string | null
};