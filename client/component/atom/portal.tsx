//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  createPortal
} from "react-dom";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./portal.scss"))
export default class Portal extends Component<Props, State> {

  public render(): ReactNode {
    let container = document.getElementById("page") ?? document.body;
    let node = (
      <div className="portal">
        {this.props.children}
      </div>
    );
    return createPortal(node, container);
  }

}


type Props = {
};
type State = {
};