//

import * as react from "react";
import {
  ChangeEvent,
  ReactNode
} from "react";
import {
  Radio
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./radio-group.scss"))
export class RadioGroup<V extends string> extends Component<Props<V>, State<V>> {

  public constructor(props: any) {
    super(props);
    if (this.props.initialValue !== undefined) {
      this.state = {value: this.props.initialValue};
    }
  }

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let value = event.target.value as V;
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  public render(): ReactNode {
    let radioNodes = Array.from(this.props.specs).map((spec, index) => {
      let checked = spec.value === this.state.value;
      return <Radio name={this.props.name} value={spec.value} label={spec.label} checked={checked} onChange={this.handleChange.bind(this)} key={index}/>;
    });
    let node = (
      <div styleName="root">
        {radioNodes}
      </div>
    );
    return node;
  }

}


type Props<V> = {
  name: string,
  specs: ArrayLike<{value: V, label: string}>,
  initialValue?: V,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onSet?: (value: V) => void
};
type State<V> = {
  value: V | null
};