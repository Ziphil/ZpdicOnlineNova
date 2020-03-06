//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./badge.scss"))
export class Badge extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <span styleName="root">
        {this.props.value}
      </span>
    );
    return node;
  }

}


type Props = {
  value: string
};
type State = {
};