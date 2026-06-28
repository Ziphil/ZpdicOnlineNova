//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, useTrans} from "zographia";
import {create} from "/client/component/create";
import {ApiCredential} from "/server/internal/skeleton";
import {ApiCredentialCard} from "./api-credential-card";


export const ApiCredentialList = create(
  require("./api-credential-list.scss"), "ApiCredentialList",
  function ({
    credentials,
    ...rest
  }: {
    credentials: Array<ApiCredential> | undefined,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("apiCredentialList");

    return (
      <List styleName="root" items={credentials} pageSpec={{size: 20}} {...rest}>
        <ListBody styleName="body">
          {(credential) => <ApiCredentialCard key={credential.id} credential={credential}/>}
          <ListLoadingView styleName="loading"/>
          <ListEmptyView styleName="loading">
            {trans("empty")}
          </ListEmptyView>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);
