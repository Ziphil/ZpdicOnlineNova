//

import * as react from "react";
import {
  Component,
  MouseEvent,
  ReactNode
} from "react";
import {
  applyStyle
} from "../../util/decorator";


@applyStyle(require("./button.scss"))
export class Button extends Component<ButtonProps, {}> {

  public static defaultProps: ButtonProps = {
    value: "",
    type: "button",
    color: null
  };

  public render(): ReactNode {
    let styleNames = ["button"];
    if (this.props.color) {
      styleNames.push(this.props.color);
    }
    return (
      <input styleName={styleNames.join(" ")} type="button" value={this.props.value} onClick={this.props.onClick}/>
    );
  }

}


type ButtonProps = {
  value: string,
  type: "button" | "submit",
  color: "green" | null,
  onClick?: ((event: MouseEvent<HTMLInputElement>) => void)
};