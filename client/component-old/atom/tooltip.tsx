//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./tooltip.scss"))
export default class Tooltip extends Component<Props, State> {

  public render(): ReactNode {
    let tooltipNode = (this.props.message !== null) && (
      <div styleName="tooltip">
        <p styleName="tooltip-text">
          {this.props.message}
        </p>
      </div>
    );
    let node = (
      <div styleName="root" className={this.props.className}>
        {this.props.children}
        {tooltipNode}
      </div>
    );
    return node;
  }

}


type Props = {
  message: string | null
  className?: string
};
type State = {
};