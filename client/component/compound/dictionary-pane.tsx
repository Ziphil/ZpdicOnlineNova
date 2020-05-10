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
  WhitePane
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  DateUtil
} from "/client/util/date";
import {
  DetailedDictionary
} from "/server/skeleton/dictionary";


@route @inject
@applyStyle(require("./dictionary-pane.scss"))
export class DictionaryPane extends StoreComponent<Props, State> {

  public static defaultProps: Partial<Props> = {
    showUser: true,
    showUpdatedDate: true,
    showSettingLink: false,
    showDownloadLink: false
  };

  private jumpSettingPage(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    event.stopPropagation();
    let path = "/dictionary-setting/" + this.props.dictionary.number;
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
    let userNode = (this.props.showUser) && (
      <div styleName="information-item">管理者 — @{this.props.dictionary.user.name}</div>
    );
    let updatedDate = this.props.dictionary.updatedDate;
    let updatedDateNode = (this.props.showUpdatedDate) && (
      <div styleName="information-item">更新日時 — {(updatedDate !== undefined) ? DateUtil.format(updatedDate, "yyyy/MM/dd HH:mm") : "?"}</div>
    );
    let settingNode = (this.props.showSettingLink) && (
      <Button label="設定" iconLabel="&#xF013;" style="simple" onClick={this.jumpSettingPage.bind(this)}/>
    );
    let downloadNode = (this.props.showDownloadLink) && (
      <Button label="ダウンロード" iconLabel="&#xF019;" style="simple" onClick={this.downloadDictionary.bind(this)}/>
    );
    let linkNode = (this.props.showSettingLink || this.props.showDownloadLink) && (
      <div styleName="setting">
        {settingNode}
        {downloadNode}
      </div>
    );
    let node = (
      <WhitePane href={href} clickable={true}>
        <div>
          <div styleName="head">
            <div styleName="left">
              <div styleName="name">{name}</div>
            </div>
            <div styleName="right">
              <div styleName="status">{statusString}</div>
            </div>
          </div>
          <div styleName="information">
            {updatedDateNode}
            {userNode}
          </div>
        </div>
        {linkNode}
      </WhitePane>
    );
    return node;
  }

}


type Props = {
  dictionary: DetailedDictionary,
  showUser: boolean,
  showUpdatedDate: boolean,
  showSettingLink: boolean,
  showDownloadLink: boolean
};
type State = {
};