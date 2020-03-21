//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./loading.scss"))
export class Loading extends Component<Props, State> {

  public render(): ReactNode {
    let node;
    if (this.props.loading) {
      node = (
        <div styleName="root">
          <span styleName="spinner"/>
        </div>
      );
    } else {
      node = this.props.children;
    }
    return node;
  }

}


type Props = {
  loading: boolean
};
type State = {
};