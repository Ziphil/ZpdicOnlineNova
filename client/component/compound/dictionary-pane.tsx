//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  DictionaryBody
} from "../../../server/type/dictionary";
import {
  applyStyle
} from "../../util/decorator";


@applyStyle(require("./dictionary-pane.scss"))
export class DictionaryPane extends Component<DictionaryPaneProps, {}> {

  public render(): ReactNode {
    let name = this.props.dictionary.name;
    let status = "";
    if (this.props.dictionary.status === "saving") {
      status = "保存処理中";
    } else {
      status = this.props.dictionary.wordSize.toLocaleString("en-GB") + " 語";
    }
    return (
      <div styleName="dictionary-pane">
        <div styleName="name">{name}</div>
        <div styleName="status">{status}</div>
      </div>
    );
  }

}


type DictionaryPaneProps = {
  dictionary: DictionaryBody
};