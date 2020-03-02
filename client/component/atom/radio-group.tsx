//

import * as react from "react";
import {
  ChangeEvent,
  Component,
  ReactNode
} from "react";
import {
  Radio
} from "/client/component/atom";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./radio-group.scss"))
export class RadioGroup extends Component<Props, State> {

  public static defaultProps: Props = {
    name: "",
    specs: []
  };

  public state: State = {
    value: null
  };

  public componentDidMount(): void {
    if (this.props.initialValue !== undefined) {
      this.setState({value: this.props.initialValue});
    }
  }

  private handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let value = event.target.value;
    this.setState({value});
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    if (this.props.onValueChange) {
      this.props.onValueChange(value);
    }
  }

  public render(): ReactNode {
    let radioNodes = this.props.specs.map((spec, index) => {
      let checked = spec.value === this.state.value;
      return <Radio name={this.props.name} value={spec.value} label={spec.label} checked={checked} onChange={this.handleChange.bind(this)} key={index}/>;
    });
    let node = (
      <div styleName="radio-group">
        {radioNodes}
      </div>
    );
    return node;
  }

}


type Props = {
  name: string,
  specs: Array<{value: string, label: string}>,
  initialValue?: string,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  onValueChange?: (value: string) => void
};
type State = {
  value: string | null
};