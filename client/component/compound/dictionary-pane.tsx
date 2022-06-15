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

    const {request} = useRequest();
    const [, {trans, transDate}] = useIntl();
    const {pushPath} = usePath();

    const jumpSettingPage = useCallback(function (event: MouseEvent<HTMLElement>): void {
      event.preventDefault();
      event.stopPropagation();
      const path = "/dashboard/dictionary/" + dictionary.number;
      pushPath(path);
    }, [dictionary.number, pushPath]);

    const downloadDictionary = useCallback(async function (event: MouseEvent<HTMLElement>): Promise<void> {
      event.preventDefault();
      event.stopPropagation();
      if (dictionary) {
        const number = dictionary.number;
        const response = await request("downloadDictionary", {number}, {responseType: "blob"});
        if (response.status === 200 && !("error" in response.data)) {
          const data = response.data;
          const disposition = response.headers["content-disposition"];
          const match = disposition.match(/filename="(.+)"/);
          const encodedMatch = disposition.match(/filename\*=UTF-8''(.+)$/);
          const fileName = (() => {
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

    const name = dictionary.name;
    const status = dictionary.status;
    const href = "/dictionary/" + (dictionary.paramName ?? dictionary.number);
    const statusString = (() => {
      if (status === "saving") {
        return trans("dictionaryPane.saving");
      } else if (status === "error") {
        return trans("dictionaryPane.error");
      } else {
        const wordSize = dictionary.wordSize;
        if (wordSize !== undefined) {
          return trans("dictionaryPane.wordSize", {wordSize});
        } else {
          return trans("dictionaryPane.wordSizeUndefined");
        }
      }
    })();
    const userNode = (showUser) && (
      <div styleName="information-item">{trans("dictionaryPane.userName")} — {dictionary.user.screenName}</div>
    );
    const updatedDateNode = (showUpdatedDate) && (
      <div styleName="information-item">{trans("dictionaryPane.updatedDate")} — {transDate(dictionary.updatedDate)}</div>
    );
    const createdDateNode = (showCreatedDate) && (
      <div styleName="information-item">{trans("dictionaryPane.createdDate")} — {transDate(dictionary.createdDate)}</div>
    );
    const settingNode = (showSettingLink) && (
      <Button label={trans("dictionaryPane.setting")} iconName="cog" variant="simple" onClick={jumpSettingPage}/>
    );
    const downloadNode = (showDownloadLink) && (
      <Button label={trans("dictionaryPane.download")} iconName="download" variant="simple" onClick={downloadDictionary}/>
    );
    const linkNode = (showSettingLink || showDownloadLink) && (
      <div styleName="setting">
        {settingNode}
        {downloadNode}
      </div>
    );
    const node = (
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