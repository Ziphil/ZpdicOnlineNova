//

import * as react from "react";
import {
  Component,
  MouseEvent,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./button.scss"))
export class Button extends Component<Props, State> {

  public static defaultProps: Partial<Props> = {
    type: "button",
    position: null,
    icon: null,
    color: null,
    disabled: false
  };

  public render(): ReactNode {
    let styleNames = ["root"];
    if (this.props.color === "simple") {
      styleNames = ["simple"];
    }
    if (this.props.position) {
      styleNames.push(this.props.position);
    }
    if (this.props.icon) {
      styleNames.push("icon");
      styleNames.push(this.props.icon);
    }
    let node = (
      <input styleName={styleNames.join(" ")} type="button" value={this.props.label} disabled={this.props.disabled} onClick={this.props.onClick}/>
    );
    return node;
  }

}


type Props = {
  label: string,
  type: "button" | "submit",
  position: "left" | "right" | null,
  icon: "awesome" | null,
  color: "simple" | null,
  disabled: boolean,
  onClick?: (event: MouseEvent<HTMLInputElement>) => void
};
type State = {
};