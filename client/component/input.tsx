//

import * as react from "react";
import {
  ChangeEvent,
  Component,
  ReactNode
} from "react";
import * as css from "react-css-modules";


@css(require("./input.scss"))
export class Input extends Component<InputProps, InputState> {

  public static defaultProps: InputProps = {
    label: "",
    inputType: "text"
  };

  public state: InputState = {
    value: ""
  };

  public constructor(props: InputProps) {
    super(props);
    this.changeText = this.changeText.bind(this);
  }

  private changeText(event: ChangeEvent<HTMLInputElement>): void {
    this.setState({value: event.target.value});
  }

  public render(): ReactNode {
    return (
      <label styleName="input-wrapper">
        <div styleName="label">{this.props.label}</div>
        <input styleName="input" type={this.props.inputType} value={this.state.value} onChange={this.changeText}/>
      </label>
    );
  }

}


interface InputProps {

  label: string;
  inputType: "text" | "password";

}


interface InputState {

  value: string;

}