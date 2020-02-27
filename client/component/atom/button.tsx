//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import * as css from "react-css-modules";


@css(require("./button.scss"), {allowMultiple: true})
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