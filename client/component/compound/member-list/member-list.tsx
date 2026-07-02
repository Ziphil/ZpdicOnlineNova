//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Member} from "/server/internal/skeleton";
import {MemberCard} from "./member-card";


export const MemberList = create(
  require("./member-list.scss"), "MemberList",
  function ({
    dictionary,
    members,
    pageSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    members: Array<Member> | undefined,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("memberList");

    return (
      <List styleName="root" items={members} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(member) => <MemberCard key={member.id} dictionary={dictionary} member={member}/>}
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
