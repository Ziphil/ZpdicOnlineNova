//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedDictionary, UserDictionary} from "/client-new/skeleton";
import {DictionaryCard} from "./dictionary-card";


export const DictionaryList = create(
  require("./dictionary-list.scss"), "DictionaryList",
  function ({
    dictionaries,
    pageSpec,
    showUser = false,
    showChart = false,
    showAuthority = false,
    showSettingLink = false,
    ...rest
  }: {
    dictionaries: Array<DetailedDictionary | UserDictionary>,
    pageSpec: PageSpec,
    showUser?: boolean,
    showChart?: boolean,
    showAuthority?: boolean,
    showSettingLink?: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <List styleName="root" items={dictionaries} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(dictionary) => (
            <DictionaryCard
              key={dictionary.id}
              dictionary={dictionary}
              showUser={showUser}
              showChart={showChart}
              showAuthority={showAuthority}
              showSettingLink={showSettingLink}
            />
          )}
          <ListLoadingView/>
          <ListEmptyView/>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);