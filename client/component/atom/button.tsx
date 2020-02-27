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
    value: ""
  };

  public render(): ReactNode {
    return (
      <input styleName="button" type="submit" value={this.props.value}/>
    );
  }

}


interface ButtonProps {

  value: string;

}