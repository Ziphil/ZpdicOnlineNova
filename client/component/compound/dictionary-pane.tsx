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
  SlimeDictionarySkeleton
} from "/server/model/dictionary/slime";


@applyStyle(require("./dictionary-pane.scss"))
class DictionaryPaneBase extends ComponentBase<Props, State> {

  private click(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    let path = "/dictionary/" + this.props.dictionary.number;
    this.props.history.push(path);
  }

  public render(): ReactNode {
    let name = this.props.dictionary.name;
    let href = "/dictionary/" + this.props.dictionary.number;
    let status = "";
    if (this.props.dictionary.status === "saving") {
      status = "保存処理中";
    } else {
      let wordSize = this.props.dictionary.wordSize;
      if (wordSize !== undefined) {
        status = wordSize.toLocaleString("en-GB") + " 語";
      } else {
        status = "? 語";
      }
    }
    let node = (
      <a styleName="dictionary-pane" href={href} onClick={this.click.bind(this)}>
        <div styleName="name">{name}</div>
        <div styleName="status">{status}</div>
      </a>
    );
    return node;
  }

}


type Props = {
  dictionary: SlimeDictionarySkeleton
};
type State = {
};

export let DictionaryPane = withRouter(DictionaryPaneBase);