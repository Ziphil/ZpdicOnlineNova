//

import * as react from "react";
import {
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import DictionaryPane from "/client/component-function/compound/dictionary-pane";
import PaneList from "/client/component-function/compound/pane-list";
import {
  create
} from "/client/component-function/create";
import {
  DetailedDictionary,
  UserDictionary
} from "/client/skeleton/dictionary";
import {
  WithSize
} from "/server/controller/internal/type";


const DictionaryList = create(
  require("./dictionary-list.scss"), "DictionaryList",
  function ({
    dictionaries,
    showUser,
    showUpdatedDate,
    showCreatedDate,
    showLinks = false,
    size
  }: {
    dictionaries: Array<DetailedDictionary> | DetailedDictionaryProvider | null,
    showUser?: boolean,
    showUpdatedDate?: boolean,
    showCreatedDate?: boolean,
    showLinks: boolean,
    size: number
  }): ReactElement {

    let renderDictionary = useCallback(function (dictionary: DetailedDictionary | UserDictionary): ReactNode {
      let actualShowLinks = showLinks && "authorities" in dictionary;
      let canOwn = "authorities" in dictionary && dictionary.authorities.indexOf("own") >= 0;
      let dictionaryNode = (
        <DictionaryPane
          dictionary={dictionary}
          key={dictionary.id}
          showUser={showUser}
          showUpdatedDate={showUpdatedDate}
          showCreatedDate={showCreatedDate}
          showSettingLink={actualShowLinks && canOwn}
          showDownloadLink={actualShowLinks}
        />
      );
      return dictionaryNode;
    }, [showUser, showUpdatedDate, showCreatedDate, showLinks]);

    let node = (
      <PaneList items={dictionaries} size={size} renderer={renderDictionary}/>
    );
    return node;

  }
);


export type DetailedDictionaryProvider = (offset?: number, size?: number) => Promise<WithSize<DetailedDictionary>>;

export default DictionaryList;