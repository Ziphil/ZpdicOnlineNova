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
  color: "simple" | null,
  disabled: boolean,
  onClick?: (event: MouseEvent<HTMLInputElement>) => void
};
type State = {
};