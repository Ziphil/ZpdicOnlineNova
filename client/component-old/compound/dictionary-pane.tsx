//

import downloadFile from "js-file-download";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import WhitePane from "/client/component/compound/white-pane";
import {
  style
} from "/client/component/decorator";
import {
  DetailedDictionary
} from "/client/skeleton/dictionary";


@style(require("./dictionary-pane.scss"))
export default class DictionaryPane extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    showUser: true,
    showUpdatedDate: true,
    showCreatedDate: false,
    showSettingLink: false,
    showDownloadLink: false
  };

  private jumpSettingPage(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    event.stopPropagation();
    let path = "/dashboard/dictionary/" + this.props.dictionary.number;
    this.pushPath(path);
  }

  private async downloadDictionary(event: MouseEvent<HTMLElement>): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.dictionary) {
      let number = this.props.dictionary.number;
      let response = await this.request("downloadDictionary", {number}, {responseType: "blob"});
      if (response.status === 200 && !("error" in response.data)) {
        let data = response.data;
        let disposition = response.headers["content-disposition"];
        let match = disposition.match(/filename="(.+)"/);
        let encodedMatch = disposition.match(/filename\*=UTF-8''(.+)$/);
        let fileName = (() => {
          if (encodedMatch !== null) {
            return decodeURIComponent(encodedMatch[1]).replace(/\+/g, " ");
          } else if (match !== null) {
            return match[1];
          } else {
            return "dictionary.json";
          }
        })();
        downloadFile(data, fileName);
      }
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
      <div styleName="information-item">{this.trans("dictionaryPane.userName")} — {this.props.dictionary.user.screenName}</div>
    );
    let updatedDateNode = (this.props.showUpdatedDate) && (
      <div styleName="information-item">{this.trans("dictionaryPane.updatedDate")} — {this.transDate(this.props.dictionary.updatedDate)}</div>
    );
    let createdDateNode = (this.props.showCreatedDate) && (
      <div styleName="information-item">{this.trans("dictionaryPane.createdDate")} — {this.transDate(this.props.dictionary.createdDate)}</div>
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
            {createdDateNode}
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
  showCreatedDate: boolean,
  showSettingLink: boolean,
  showDownloadLink: boolean
};
type DefaultProps = {
  showUser: boolean,
  showUpdatedDate: boolean,
  showCreatedDate: boolean,
  showSettingLink: boolean,
  showDownloadLink: boolean
};
type State = {
};