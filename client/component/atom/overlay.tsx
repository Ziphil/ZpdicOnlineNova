//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Portal
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";
import {
  createStyleName
} from "/client/util/style-names";


@applyStyle(require("./overlay.scss"))
export class Overlay extends Component<Props, State> {

  public render(): ReactNode {
    let contentStyleName = createStyleName("content", this.props.size);
    let node = (this.props.open) && (
      <Portal>
        <div styleName="background" onClick={this.props.onClose}/>
        <div styleName="content-wrapper">
          <div styleName={contentStyleName}>
            {this.props.children}
          </div>
        </div>
      </Portal>
    );
    return node;
  }

}


type Props = {
  size: "large" | "small",
  open: boolean,
  onClose?: (event: MouseEvent<HTMLDivElement>) => void
};
type State = {
};