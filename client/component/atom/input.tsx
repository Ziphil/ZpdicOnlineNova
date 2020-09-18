//

import * as react from "react";
import {
  ChangeEvent,
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./input.scss"))
export default class Input extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    value: "",
    type: "text",
    usesTooltip: true,
    readOnly: false,
    disabled: false
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
      let errorMessage = validate(value);
      this.setState({errorMessage});
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

  private toggleType(): void {
    if (this.state.type === "text") {
      this.setState({type: "password"});
    } else {
      this.setState({type: "text"});
    }
  }

  public render(): ReactNode {
    let inputStyleName = StyleNameUtil.create(
      "input",
      {if: this.state.errorMessage !== null, true: "error"}
    );
    let labelNode = (this.props.label !== undefined) && (() => {
      let labelStyleName = StyleNameUtil.create(
        "label",
        {if: this.state.errorMessage !== null, true: "error"}
      );
      return <div styleName={labelStyleName}>{this.props.label}</div>;
    })();
    let prefixNode = (this.props.prefix !== undefined) && (
      <div styleName="prefix">{this.props.prefix}</div>
    );
    let suffixNode = (this.props.suffix !== undefined) && (
      <div styleName="suffix">{this.props.suffix}</div>
    );
    let eyeNode = (this.props.type === "flexible") && (() => {
      let buttonStyleName = StyleNameUtil.create("eye", this.state.type);
      return <span styleName={buttonStyleName} onClick={this.toggleType.bind(this)}/>;
    })();
    let tooltipNode = (this.state.errorMessage !== null) && (
      <div styleName="tooltip">
        <p styleName="tooltip-text">
          {this.state.errorMessage}
        </p>
      </div>
    );
    let node = (
      <div styleName="root" className={this.props.className}>
        <label styleName="label-wrapper">
          {labelNode}
          <div styleName={inputStyleName}>
            {prefixNode}
            <input styleName="input-inner" type={this.state.type} value={this.props.value} readOnly={this.props.readOnly} disabled={this.props.disabled} onChange={this.handleChange.bind(this)}/>
            {suffixNode}
          </div>
          {eyeNode}
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
  prefix?: ReactNode,
  suffix?: ReactNode,
  type: "text" | "password" | "flexible",
  validate?: (value: string) => string | null,
  usesTooltip: boolean,
  readOnly: boolean,
  disabled: boolean,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: string) => void,
  className?: string
};
type DefaultProps = {
  value: string,
  type: "text" | "password" | "flexible",
  usesTooltip: boolean,
  readOnly: boolean,
  disabled: boolean
};
type State = {
  type: "text" | "password",
  errorMessage: string | null
};