//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./suggestion.scss"))
export default class Suggestion<V> extends Component<Props<V>, State<V>> {

  private handleMouseDown(value: V, event: MouseEvent<HTMLDivElement>): void {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    if (this.props.onSet) {
      this.props.onSet(value);
    }
  }

  public render(): ReactNode {
    let itemNodes = this.props.specs.map((spec, index) => {
      let itemNode = (
        <div styleName="suggestion-item" key={index} tabIndex={0} onMouseDown={(event) => this.handleMouseDown(spec.value, event)}>
          {spec.node}
        </div>
      );
      return itemNode;
    });
    let suggestionNode = (this.props.specs.length > 0) && (
      <div styleName="suggestion">
        {itemNodes}
      </div>
    );
    let node = (
      <div styleName="root" className={this.props.className}>
        {this.props.children}
        {suggestionNode}
      </div>
    );
    return node;
  }

}


type Props<V> = {
  specs: Array<SuggestionSpec<V>>
  onClick?: (event: MouseEvent<HTMLDivElement>) => void,
  onSet?: (value: V) => void,
  className?: string
};
type State<V> = {
};

export type SuggestionSpec<V> = {value: V, node: ReactNode};