//

import * as react from "react";
import {
  ReactNode
} from "react";
import Dropdown from "/client/component/atom/dropdown";
import Label from "/client/component/atom/label";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./selection.scss"))
export default class Selection<V> extends Component<Props<V>, State<V>> {

  private renderSelection(): ReactNode {
    let text = Array.from(this.props.specs).find((spec) => spec.value === this.props.value)!.text;
    let node = (
      <button styleName="selection">
        <div styleName="text">{text}</div>
        <div styleName="icon"/>
      </button>
    );
    return node;
  }

  public render(): ReactNode {
    let dropdownSpecs = Array.from(this.props.specs).map((spec) => ({value: spec.value, node: spec.text}));
    let selectionNode = this.renderSelection();
    let node = (
      <div styleName="root" className={this.props.className}>
        <Dropdown specs={dropdownSpecs} onSet={this.props.onSet}>
          <label styleName="label-wrapper">
            <Label text={this.props.label} showRequired={this.props.showRequired} showOptional={this.props.showOptional}/>
            {selectionNode}
          </label>
        </Dropdown>
      </div>
    );
    return node;
  }

}


type Props<V> = {
  value: V,
  label?: string,
  specs: ArrayLike<SelectionSpec<V>>,
  showRequired?: boolean,
  showOptional?: boolean,
  onSet?: (value: V) => void,
  className?: string
};
type State<V> = {
};

export type SelectionSpec<V> = {value: V, text: string};