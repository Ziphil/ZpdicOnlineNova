//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


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