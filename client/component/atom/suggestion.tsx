//

import * as react from "react";
import {
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Label from "/client/component/atom/label";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  debounce
} from "/client/util/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./suggestion.scss"))
export default class Suggestion extends Component<Props, State> {

  private handleMouseDown(event: MouseEvent<HTMLDivElement>, replacement: string): void {
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
        <div styleName="suggestion-item" key={index} tabIndex={0} onMouseDown={(event) => this.handleMouseDown(event, spec.replacement)}>
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


type Props = {
  specs: Array<SuggestionSpec>
  onClick?: (event: MouseEvent<HTMLDivElement>) => void,
  onSet?: (value: string) => void,
  className?: string
};
type State = {
};

export type SuggestionSpec = {node: ReactNode, replacement: string};
export type SuggestFunction = (pattern: string) => AsyncOrSync<Array<Suggestion>>;