//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Button
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./information-pane.scss"))
export class InformationPane extends Component<Props, State> {

  public render(): ReactNode {
    let itemNodes = this.props.texts.map((text, index) => {
      return <li key={index}>{text}</li>;
    });
    let styleNames = ["root", this.props.style];
    let node = (
      <div styleName={styleNames.join(" ")}>
        <ul styleName="list">
          {itemNodes}
        </ul>
        <div styleName="button-box"/>
        <div styleName="overlay"/>
        <div styleName="button">
          <Button label="&#xF00D;" style="simple" usesIcon={true}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  texts: Array<string>,
  style: "error" | "information"
};
type State = {
};