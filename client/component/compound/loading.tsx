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


@applyStyle(require("./loading.scss"))
export class Loading extends Component<Props, State> {

  public render(): ReactNode {
    if (this.props.loading) {
      let node = (
        <div styleName="root">
          <span styleName="spinner"/>
        </div>
      );
      return node;
    } else {
      return this.props.children;
    }
  }

}


type Props = {
  loading: boolean
};
type State = {
};