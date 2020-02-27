//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "../util/decorator";


@applyStyle(require("./button.scss"))
export class Button extends Component<ButtonProps, {}> {

  public static defaultProps: ButtonProps = {
    value: "",
    color: null
  };

  public render(): ReactNode {
    let styleNames = ["button"];
    if (this.props.color) {
      styleNames.push(this.props.color);
    }
    return (
      <input styleName={styleNames.join(" ")} type="submit" value={this.props.value}/>
    );
  }

}


interface ButtonProps {

  value: string;
  color: "green" | null;

}