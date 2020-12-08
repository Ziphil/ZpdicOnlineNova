//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./information-pane.scss"))
export default class InformationPane extends Component<Props, State> {

  private handleClick(event: MouseEvent<HTMLButtonElement>): void {
    if (this.props.onClose) {
      this.props.onClose(event);
    }
  }

  public render(): ReactNode {
    let styleName = StyleNameUtil.create("root", this.props.style);
    let itemNodes = this.props.texts.map((text, index) => {
      let itemNode = <li key={index}>{text}</li>;
      return itemNode;
    });
    let node = (
      <div styleName={styleName}>
        <ul styleName="list">
          {itemNodes}
        </ul>
        <div styleName="button-box"/>
        <div styleName="overlay"/>
        <div styleName="button">
          <Button iconLabel="&#xF00D;" style="simple" onClick={this.handleClick.bind(this)}/>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  texts: Array<string>,
  style: "error" | "information",
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void
};
type State = {
};