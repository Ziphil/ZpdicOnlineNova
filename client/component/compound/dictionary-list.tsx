//

import {
  ReactElement
} from "react";
import DictionaryPane from "/client/component/compound/dictionary-pane";
import PaneList from "/client/component/compound/pane-list-beta";
import {
  create
} from "/client/component/create";
import {
  DetailedDictionary,
  UserDictionary
} from "/client/skeleton/dictionary";


const DictionaryList = create(
  require("./dictionary-list.scss"), "DictionaryList",
  function ({
    dictionaries,
    showUser,
    showUpdatedDate,
    showCreatedDate,
    showLinks = false,
    column,
    size,
    hitSize,
    page,
    onPageSet
  }: {
    dictionaries: Array<DetailedDictionary> | Array<UserDictionary>,
    showUser?: boolean,
    showUpdatedDate?: boolean,
    showCreatedDate?: boolean,
    showLinks?: boolean,
    column?: number,
    size: number,
    hitSize?: number,
    page?: number,
    onPageSet?: (page: number) => void
  }): ReactElement {

    const node = (
      <PaneList
        items={dictionaries}
        column={column}
        size={size}
        hitSize={hitSize}
        page={page}
        onPageSet={onPageSet}
      >
        {(dictionary) => (
          <DictionaryListPane
            key={dictionary.id}
            dictionary={dictionary}
            showUser={showUser}
            showUpdatedDate={showUpdatedDate}
            showCreatedDate={showCreatedDate}
            showLinks={showLinks}
          />
        )}
      </PaneList>
    );
    return node;

  }
);


const DictionaryListPane = create(
  require("./dictionary-list.scss"), "DictionaryListPane",
  function ({
    dictionary,
    showUser,
    showUpdatedDate,
    showCreatedDate,
    showLinks
  }: {
    dictionary: DetailedDictionary | UserDictionary,
    showUser?: boolean,
    showUpdatedDate?: boolean,
    showCreatedDate?: boolean,
    showLinks?: boolean
  }): ReactElement {

    const actualShowLinks = showLinks && "authorities" in dictionary;
    const canOwn = "authorities" in dictionary && dictionary.authorities.indexOf("own") >= 0;
    const node = (
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
    return node;

  }
);


export default DictionaryList;