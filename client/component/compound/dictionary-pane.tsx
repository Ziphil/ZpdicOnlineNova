//

import * as react from "react";
import {
  MouseEvent,
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
import {
  DictionaryBody
} from "/server/type/dictionary";


@applyStyle(require("./dictionary-pane.scss"))
class DictionaryPaneBase extends ComponentBase<Props, State> {

  private click(event: MouseEvent<HTMLElement>): void {
    let path = "/dictionary/" + this.props.dictionary.number;
    this.props.history.push(path);
  }

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
      <div styleName="dictionary-pane" onClick={this.click.bind(this)}>
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