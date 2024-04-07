//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {Commission, DictionaryWithExecutors} from "/client/skeleton";
import {CommissionCard} from "./commission-card";


export const CommissionList = create(
  require("./commission-list.scss"), "CommissionList",
  function ({
    dictionary,
    commissions,
    pageSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    commissions: Array<Commission>,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("commissionList");

    return (
      <List styleName="root" items={commissions} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(commission) => <CommissionCard key={commission.id} dictionary={dictionary} commission={commission}/>}
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