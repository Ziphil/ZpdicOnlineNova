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
  intl,
  route
} from "/client/component/decorator";
import {
  DetailedDictionary
} from "/server/skeleton/dictionary";


@route @inject @intl
@applyStyle(require("./dictionary-pane.scss"))
export class DictionaryPane extends StoreComponent<Props, State> {

  public static defaultProps: DefaultProps = {
    showUser: true,
    showUpdatedDate: true,
    showSettingLink: false,
    showDownloadLink: false
  };

  private jumpSettingPage(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    event.stopPropagation();
    let path = "/dashboard/dictionary/" + this.props.dictionary.number;
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
        return this.trans("dictionaryPane.saving");
      } else if (status === "error") {
        return this.trans("dictionaryPane.error");
      } else {
        let wordSize = this.props.dictionary.wordSize;
        if (wordSize !== undefined) {
          return this.trans("dictionaryPane.wordSize", {wordSize});
        } else {
          return this.trans("dictionaryPane.wordSizeUndefined");
        }
      }
    })();
    let userNode = (this.props.showUser) && (
      <div styleName="information-item">{this.trans("dictionaryPane.userName")} — @{this.props.dictionary.user.name}</div>
    );
    let updatedDateNode = (this.props.showUpdatedDate) && (
      <div styleName="information-item">{this.trans("dictionaryPane.updatedDate")} — {this.transDate(this.props.dictionary.updatedDate)}</div>
    );
    let settingNode = (this.props.showSettingLink) && (
      <Button label={this.trans("dictionaryPane.setting")} iconLabel="&#xF013;" style="simple" onClick={this.jumpSettingPage.bind(this)}/>
    );
    let downloadNode = (this.props.showDownloadLink) && (
      <Button label={this.trans("dictionaryPane.download")} iconLabel="&#xF019;" style="simple" onClick={this.downloadDictionary.bind(this)}/>
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
type DefaultProps = {
  showUser: boolean,
  showUpdatedDate: boolean,
  showSettingLink: boolean,
  showDownloadLink: boolean
};
type State = {
};