//

import * as react from "react";
import {
  ChangeEvent,
  ReactNode
} from "react";
import Radio from "/client/component/atom/radio";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./radio-group.scss"))
export default class RadioGroup<V extends string> extends Component<Props<V>, State<V>> {

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let value = event.target.value as V;
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  public render(): ReactNode {
    let radioNodes = Array.from(this.props.specs).map((spec, index) => {
      let checked = spec.value === this.props.value;
      return <Radio name={this.props.name} value={spec.value} label={spec.label} checked={checked} onChange={this.handleChange.bind(this)} key={index}/>;
    });
    let node = (
      <div styleName="root" className={this.props.className}>
        {radioNodes}
      </div>
    );
    return node;
  }

}


type Props<V> = {
  value: V | null,
  name: string,
  specs: ArrayLike<{value: V, label: string}>,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: V) => void,
  className?: string
};
type State<V> = {
};