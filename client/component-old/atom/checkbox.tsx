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


@style(require("./checkbox.scss"))
export default class Checkbox extends Component<Props, State> {

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (this.props.onSet) {
      this.props.onSet(event.target.checked);
    }
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  public render(): ReactNode {
    let node = (
      <label styleName="root" className={this.props.className}>
        <input styleName="checkbox" type="checkbox" name={this.props.name} value={this.props.value} checked={this.props.checked} onChange={this.handleChange.bind(this)}/>
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
  onSet?: (checked: boolean) => void,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  className?: string
};
type State = {
};