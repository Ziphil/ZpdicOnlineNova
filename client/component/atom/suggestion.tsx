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
export default class Suggestion<R extends string> extends Component<Props<R>, State<R>> {

  private handleMouseDown(replacement: R, event: MouseEvent<HTMLDivElement>): void {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    if (this.props.onSet) {
      this.props.onSet(replacement);
    }
  }

  public render(): ReactNode {
    let itemNodes = this.props.specs.map((spec, index) => {
      let itemNode = (
        <div styleName="suggestion-item" key={index} tabIndex={0} onMouseDown={(event) => this.handleMouseDown(spec.replacement, event)}>
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


type Props<R> = {
  specs: Array<SuggestionSpec<R>>
  onClick?: (event: MouseEvent<HTMLDivElement>) => void,
  onSet?: (replacement: R) => void,
  className?: string
};
type State<R> = {
};

export type SuggestionSpec<R> = {replacement: R, node: ReactNode};