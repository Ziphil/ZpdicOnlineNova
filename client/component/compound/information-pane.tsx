//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./information-pane.scss"))
export class InformationPane extends Component<Props, State> {

  public render(): ReactNode {
    let itemNodes = this.props.texts.map((text, index) => {
      return <li key={index}>{text}</li>;
    });
    let styleNames = ["root", this.props.color];
    let node = (
      <ul styleName={styleNames.join(" ")}>
        {itemNodes}
      </ul>
    );
    return node;
  }

}


type Props = {
  texts: Array<String>,
  color: "error" | "information"
};
type State = {
};