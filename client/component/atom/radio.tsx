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


@style(require("./radio.scss"))
export default class Radio extends Component<Props, State> {

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  public render(): ReactNode {
    let node = (
      <label styleName="root" className={this.props.className}>
        <input styleName="radio" type="radio" name={this.props.name} value={this.props.value} checked={this.props.checked} onChange={this.handleChange.bind(this)}/>
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
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  className?: string
};
type State = {
};