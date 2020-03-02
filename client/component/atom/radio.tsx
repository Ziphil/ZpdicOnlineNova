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


@applyStyle(require("./radio.scss"))
export class Radio extends Component<Props, State> {

  public static defaultProps: Props = {
    name: "",
    label: "",
    value: "",
    checked: false
  };

  private change(event: ChangeEvent<HTMLInputElement>): void {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  public render(): ReactNode {
    let node = (
      <label styleName="radio-wrapper">
        <input styleName="radio" type="radio" name={this.props.name} value={this.props.value} checked={this.props.checked} onChange={this.change.bind(this)}/>
        <span styleName="label">{this.props.label}</span>
      </label>
    );
    return node;
  }

}


type Props = {
  name: string,
  value: string,
  label: string,
  checked: boolean,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
};
type State = {
};