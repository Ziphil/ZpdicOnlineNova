//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./dictionary-header.scss"))
export class DictionaryHeader extends Component<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="container">
          <div styleName="left">
            <div styleName="name">{this.props.name}</div>
          </div>
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  name: string
};
type State = {
};