//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  DictionaryBody
} from "../../../server/type/dictionary";
import {
  applyStyle
} from "../../util/decorator";
import {
  ComponentBase
} from "../component";


@applyStyle(require("./dictionary-pane.scss"))
class DictionaryPaneBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let name = this.props.dictionary.name;
    let status = "";
    if (this.props.dictionary.status === "saving") {
      status = "保存処理中";
    } else {
      let wordSize = this.props.dictionary.wordSize;
      status = wordSize.toLocaleString("en-GB") + " 語";
    }
    let node = (
      <div styleName="dictionary-pane">
        <div styleName="name">{name}</div>
        <div styleName="status">{status}</div>
      </div>
    );
    return node;
  }

}


type Props = {
  dictionary: DictionaryBody
};
type State = {
};

export let DictionaryPane = withRouter(DictionaryPaneBase);