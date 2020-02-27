//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import * as css from "react-css-modules";


@css(require("./button.scss"))
export class Button extends Component<ButtonProps, {}> {

  public static defaultProps: ButtonProps = {
    value: "",
    color: "default"
  };

  public render(): ReactNode {
    let color = (this.props.color === "default") ? undefined : this.props.color;
    return (
      <input styleName="button" className={color} type="submit" value={this.props.value}/>
    );
  }

}


interface ButtonProps {

  value: string;
  color: "default" | "green";

}