//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListPagination} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedDictionary, UserDictionary} from "/client-new/skeleton";
import {DictionaryCard} from "./dictionary-card";


export const DictionaryList = create(
  require("./dictionary-list.scss"), "DictionaryList",
  function ({
    dictionaries,
    size,
    showUser = false,
    showChart = false,
    showAuthority = false,
    hitSize,
    page,
    onPageSet,
    ...rest
  }: {
    dictionaries: Array<DetailedDictionary | UserDictionary>,
    size: number,
    showUser?: boolean,
    showChart?: boolean,
    showAuthority?: boolean,
    hitSize?: number,
    page?: number,
    onPageSet?: (page: number) => unknown,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <List styleName="root" items={dictionaries} size={size} hitSize={hitSize} page={page} onPageSet={onPageSet} {...rest}>
        <ListBody styleName="body">
          {(dictionary) => (
            <DictionaryCard
              key={dictionary.id}
              dictionary={dictionary}
              showUser={showUser}
              showChart={showChart}
              showAuthority={showAuthority}
            />
          )}
          <ListEmptyView/>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);