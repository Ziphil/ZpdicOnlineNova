//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec} from "zographia";
import {create} from "/client-new/component/create";
import {Commission, EnhancedDictionary} from "/client-new/skeleton";
import {CommissionCard} from "./commission-card";


export const CommissionList = create(
  require("./commission-list.scss"), "CommissionList",
  function ({
    dictionary,
    commissions,
    pageSpec,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    commissions: Array<Commission>,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <List styleName="root" items={commissions} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(commission) => <CommissionCard key={commission.id} dictionary={dictionary} commission={commission}/>}
          <ListLoadingView/>
          <ListEmptyView/>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);