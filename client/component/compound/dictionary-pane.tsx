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
  DateUtil
} from "/client/util/date";
import {
  SlimeDictionarySkeleton
} from "/server/skeleton/dictionary/slime";


@route @inject
@applyStyle(require("./dictionary-pane.scss"))
export class DictionaryPane extends StoreComponent<Props, State> {

  private handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    let path = event.currentTarget.attributes.getNamedItem("href")!.value;
    this.pushPath(path);
  }

  private jumpSettingPage(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    event.stopPropagation();
    let path = "/dictionary/setting/" + this.props.dictionary.number;
    this.pushPath(path);
  }

  private downloadDictionary(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.dictionary) {
      let path = "/api/dictionary/download?number=" + this.props.dictionary.number;
      location.replace(path);
    }
  }

  public render(): ReactNode {
    let name = this.props.dictionary.name;
    let status = this.props.dictionary.status;
    let href = "/dictionary/" + (this.props.dictionary.paramName ?? this.props.dictionary.number);
    let statusString = (() => {
      if (status === "saving") {
        return "処理中";
      } else if (status === "error") {
        return "エラー";
      } else {
        let wordSize = this.props.dictionary.wordSize;
        if (wordSize !== undefined) {
          return wordSize.toLocaleString("en-GB") + " 語";
        } else {
          return "? 語";
        }
      }
    })();
    let settingNode = (this.props.showsSetting) && (
      <div styleName="setting">
        <Button label="設定" iconLabel="&#xF013;" style="simple" onClick={this.jumpSettingPage.bind(this)}/>
        <Button label="ダウンロード" iconLabel="&#xF019;" style="simple" onClick={this.downloadDictionary.bind(this)}/>
      </div>
    );
    let userNode = (!this.props.showsSetting) && (
      <div styleName="information-item">管理者 — @{this.props.dictionary.userName}</div>
    );
    let updatedDate = this.props.dictionary.updatedDate;
    let updatedDateString = (updatedDate !== null) ? DateUtil.format(updatedDate, "yyyy/MM/dd HH:mm") : "?";
    let node = (
      <a styleName="root" href={href} onClick={this.handleClick.bind(this)}>
        <div styleName="head">
          <div styleName="left">
            <div styleName="name">{name}</div>
          </div>
          <div styleName="right">
            <div styleName="status">{statusString}</div>
          </div>
        </div>
        <div styleName="information">
          <div styleName="information-item">最終更新 — {updatedDateString}</div>
          {userNode}
        </div>
        {settingNode}
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