//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithAuthorities, DictionaryWithUser} from "/server/internal/skeleton";
import {DictionaryCard} from "./dictionary-card";


export const DictionaryList = create(
  require("./dictionary-list.scss"), "DictionaryList",
  function ({
    dictionaries,
    type,
    pageSpec,
    showUser = false,
    showChart = false,
    showAuthority = false,
    showSettingLink = false,
    ...rest
  }: {
    dictionaries: Array<DictionaryWithUser | DictionaryWithAuthorities>,
    type: "user" | "all",
    pageSpec: PageSpec,
    showUser?: boolean,
    showChart?: boolean,
    showAuthority?: boolean,
    showSettingLink?: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryList");

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
          <ListEmptyView>
            {trans(`empty.${type}`)}
          </ListEmptyView>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);