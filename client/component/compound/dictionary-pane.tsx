//

import downloadFile from "js-file-download";
import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback
} from "react";
import Button from "/client/component/atom/button";
import WhitePane from "/client/component/compound/white-pane";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePath,
  useRequest
} from "/client/component/hook";
import {
  DetailedDictionary
} from "/client/skeleton/dictionary";


const DictionaryPane = create(
  require("./dictionary-pane.scss"), "DictionaryPane",
  function ({
    dictionary,
    showUser = true,
    showUpdatedDate = true,
    showCreatedDate = false,
    showSettingLink = false,
    showDownloadLink = false
  }: {
    dictionary: DetailedDictionary,
    showUser?: boolean,
    showUpdatedDate?: boolean,
    showCreatedDate?: boolean,
    showSettingLink?: boolean,
    showDownloadLink?: boolean
  }): ReactElement {

    let {request} = useRequest();
    let [, {trans, transDate}] = useIntl();
    let {pushPath} = usePath();

    let jumpSettingPage = useCallback(function (event: MouseEvent<HTMLElement>): void {
      event.preventDefault();
      event.stopPropagation();
      let path = "/dashboard/dictionary/" + dictionary.number;
      pushPath(path);
    }, [dictionary.number, pushPath]);

    let downloadDictionary = useCallback(async function (event: MouseEvent<HTMLElement>): Promise<void> {
      event.preventDefault();
      event.stopPropagation();
      if (dictionary) {
        let number = dictionary.number;
        let response = await request("downloadDictionary", {number}, {responseType: "blob"});
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
    }, [dictionary, request]);

    let name = dictionary.name;
    let status = dictionary.status;
    let href = "/dictionary/" + (dictionary.paramName ?? dictionary.number);
    let statusString = (() => {
      if (status === "saving") {
        return trans("dictionaryPane.saving");
      } else if (status === "error") {
        return trans("dictionaryPane.error");
      } else {
        let wordSize = dictionary.wordSize;
        if (wordSize !== undefined) {
          return trans("dictionaryPane.wordSize", {wordSize});
        } else {
          return trans("dictionaryPane.wordSizeUndefined");
        }
      }
    })();
    let userNode = (showUser) && (
      <div styleName="information-item">{trans("dictionaryPane.userName")} — {dictionary.user.screenName}</div>
    );
    let updatedDateNode = (showUpdatedDate) && (
      <div styleName="information-item">{trans("dictionaryPane.updatedDate")} — {transDate(dictionary.updatedDate)}</div>
    );
    let createdDateNode = (showCreatedDate) && (
      <div styleName="information-item">{trans("dictionaryPane.createdDate")} — {transDate(dictionary.createdDate)}</div>
    );
    let settingNode = (showSettingLink) && (
      <Button label={trans("dictionaryPane.setting")} iconLabel="&#xF013;" style="simple" onClick={jumpSettingPage}/>
    );
    let downloadNode = (showDownloadLink) && (
      <Button label={trans("dictionaryPane.download")} iconLabel="&#xF019;" style="simple" onClick={downloadDictionary}/>
    );
    let linkNode = (showSettingLink || showDownloadLink) && (
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
);


export default DictionaryPane;