/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, PageSpec, useTrans} from "zographia";
import {UserList} from "/client/component/compound/user-list";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Member} from "/server/internal/skeleton";
import {MemberFooter} from "./member-footer";


export const MemberList = create(
  null, "MemberList",
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
      <UserList users={members?.map((member) => member.user)} pageSpec={pageSpec} emptyMessage={trans("empty")} {...rest} renderFooter={(user) => (
        <MemberFooter dictionary={dictionary} user={user}/>
      )}/>
    );

  }
);