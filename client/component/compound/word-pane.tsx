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


@applyStyle(require("./word-pane.scss"))
class WordPaneBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="word-pane">
      </div>
    );
    return node;
  }

}


type Props = {
  word: any
};
type State = {
};

export let WordPane = withRouter(WordPaneBase);