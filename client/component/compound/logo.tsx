//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  VERSION
} from "/client/variable";


@style(require("./logo.scss"))
export default class Logo extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="title">ZpDIC</div>
        <div styleName="subtitle">Online</div>
        <div styleName="version">ver {VERSION}</div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};