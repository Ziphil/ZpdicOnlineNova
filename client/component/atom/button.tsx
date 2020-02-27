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
    color: undefined
  };

  public render(): ReactNode {
    return (
      <input styleName="button" className={this.props.color} type="submit" value={this.props.value}/>
    );
  }

}


interface ButtonProps {

  value: string;
  color: undefined | "green";

}