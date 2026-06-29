/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, PageSpec, useTrans} from "zographia";
import {UserList} from "/client/component/compound/user-list";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {MemberFooter} from "./member-footer";


export const MemberList = create(
  null, "MemberList",
  function ({
    dictionary,
    pageSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("memberList");

    const number = dictionary.number;
    const [members] = useResponse("fetchMembers", {number, authorityQuery: {authority: "edit", exact: true}});

    return (
      <UserList users={members} pageSpec={{size: 20}} emptyMessage={trans("empty")} {...rest} renderFooter={(user) => (
        <MemberFooter dictionary={dictionary} user={user}/>
      )}/>
    );

  }
);