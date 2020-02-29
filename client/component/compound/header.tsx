//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import {
  applyStyle
} from "../../util/decorator";


@applyStyle(require("./header.scss"))
class HeaderBase extends Component<RouteComponentProps<{}> & Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="header">
        <div styleName="left">
          <div styleName="title">ZpDIC</div>
        </div>
        <div styleName="right">
          dammy
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};

export let Header = withRouter(HeaderBase);