//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./control-group.scss"))
export default class ControlGroup extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root" className={this.props.className}>
        {this.props.children}
      </div>
    );
    return node;
  }

}


type Props = {
  className?: string
};
type State = {
};