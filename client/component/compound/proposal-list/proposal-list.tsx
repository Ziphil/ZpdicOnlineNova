//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Proposal} from "/server/internal/skeleton";
import {ProposalCard} from "./proposal-card";


export const ProposalList = create(
  require("./proposal-list.scss"), "ProposalList",
  function ({
    dictionary,
    proposals,
    pageSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    proposals: Array<Proposal>,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("proposalList");

    return (
      <List styleName="root" items={proposals} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(proposal) => <ProposalCard key={proposal.id} dictionary={dictionary} proposal={proposal}/>}
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