//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./dictionary-header.scss"))
class DictionaryHeaderBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="left">
          <div styleName="name">{this.props.name}</div>
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

export let DictionaryHeader = withRouter(DictionaryHeaderBase);