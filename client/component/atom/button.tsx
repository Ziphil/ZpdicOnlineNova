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

  public static defaultProps: Props = {
    value: "",
    type: "button",
    color: null
  };

  public render(): ReactNode {
    let styleNames = ["button"];
    if (this.props.color === "simple") {
      styleNames = ["simple"];
    }
    let node = (
      <input styleName={styleNames.join(" ")} type="button" value={this.props.value} onClick={this.props.onClick}/>
    );
    return node;
  }

}


type Props = {
  value: string,
  type: "button" | "submit",
  color: "simple" | null,
  onClick?: (event: MouseEvent<HTMLInputElement>) => void
};
type State = {
};