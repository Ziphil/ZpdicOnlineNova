//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  SlimeDictionarySkeleton
} from "/server/model/dictionary/slime";


@route @inject
@applyStyle(require("./dictionary-pane.scss"))
export class DictionaryPane extends StoreComponent<Props, State> {

  private click(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    let path = "/dictionary/" + this.props.dictionary.number;
    this.pushPath(path);
  }

  private jumpSettingPage(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    event.stopPropagation();
    let path = "/dictionary/setting/" + this.props.dictionary.number;
    this.pushPath(path);
  }

  public render(): ReactNode {
    let name = this.props.dictionary.name;
    let status = this.props.dictionary.status;
    let href = "/dictionary/" + this.props.dictionary.number;
    let statusString = "";
    if (status === "saving") {
      statusString = "処理中";
    } else if (status === "error") {
      statusString = "エラー";
    } else {
      let wordSize = this.props.dictionary.wordSize;
      if (wordSize !== undefined) {
        statusString = wordSize.toLocaleString("en-GB") + " 語";
      } else {
        statusString = "? 語";
      }
    }
    let settingButtonNode;
    if (this.props.showsSetting) {
      settingButtonNode = <Button label="&#xF013;" style="simple" usesIcon={true} onClick={this.jumpSettingPage.bind(this)}/>;
    }
    let node = (
      <a styleName="root" href={href} onClick={this.click.bind(this)}>
        <div styleName="name">
          {settingButtonNode}
          {name}
        </div>
        <div styleName="status">{statusString}</div>
      </a>
    );
    return node;
  }

}


type Props = {
  dictionary: SlimeDictionarySkeleton,
  showsSetting: boolean
};
type State = {
};