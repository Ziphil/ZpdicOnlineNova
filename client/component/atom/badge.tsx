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
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./badge.scss"))
export default class Badge extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    style: "normal"
  };

  public render(): ReactNode {
    let styleName = StyleNameUtil.create(
      "root",
      {if: this.props.style === "highlight", true: "highlight"}
    );
    let value = (() => {
      if (typeof this.props.value === "number") {
        return this.transNumber(this.props.value);
      } else {
        return this.props.value;
      }
    })();
    let node = (
      <span styleName={styleName} className={this.props.className}>
        {value}
      </span>
    );
    return node;
  }

}


type Props = {
  value: string | number,
  style: "normal" | "highlight",
  className?: string
};
type DefaultProps = {
  style: "normal" | "highlight"
};
type State = {
};