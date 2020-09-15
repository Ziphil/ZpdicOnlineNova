//

import * as react from "react";
import {
  Fragment,
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./loading.scss"))
export default class Loading extends Component<Props, State> {

  public render(): ReactNode {
    if (this.props.loading) {
      let node = (
        <div styleName="root">
          <span styleName="spinner"/>
        </div>
      );
      return node;
    } else {
      let node = (
        <Fragment>
          {this.props.children}
        </Fragment>
      );
      return node;
    }
  }

}


type Props = {
  loading: boolean
};
type State = {
};