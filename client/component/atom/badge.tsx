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
import {
  StyleNameUtil
} from "/client/util/style-name";


@applyStyle(require("./badge.scss"))
export class Badge extends Component<Props, State> {

  public static defaultProps: Props = {
    value: "",
    style: "normal"
  };

  public render(): ReactNode {
    let styleName = StyleNameUtil.create(
      "root",
      {if: this.props.style === "highlight", true: "highlight"}
    );
    let node = (
      <span styleName={styleName} className={this.props.className}>
        {this.props.value}
      </span>
    );
    return node;
  }

}


type Props = {
  value: string,
  style: "normal" | "highlight",
  className?: string
};
type State = {
};