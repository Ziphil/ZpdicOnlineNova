//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./loading.scss"))
class LoadingBase extends ComponentBase<Props, State> {

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

export let Loading = withRouter(LoadingBase);