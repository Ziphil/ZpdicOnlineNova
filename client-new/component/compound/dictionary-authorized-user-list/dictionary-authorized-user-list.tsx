/* eslint-disable react/jsx-closing-bracket-location */
//

import {ReactElement} from "react";
import {AdditionalProps, PageSpec, useTrans} from "zographia";
import {UserList} from "/client-new/component/compound/user-list";
import {create} from "/client-new/component/create";
import {useResponse} from "/client-new/hook/request";
import {EnhancedDictionary} from "/client-new/skeleton";
import {DictionaryAuthorizedUserFooter} from "./dictionary-authorized-user-footer";


export const DictionaryAuthorizedUserList = create(
  null, "DictionaryAuthorizedUserList",
  function ({
    dictionary,
    pageSpec,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryAuthorizedUserList");

    const number = dictionary.number;
    const [authorizedUsers] = useResponse("fetchDictionaryAuthorizedUsers", {number, authority: "editOnly"});

    return (
      <UserList users={authorizedUsers} pageSpec={{size: 20}} emptyMessage={trans("empty")} {...rest} renderFooter={(user) => (
        <DictionaryAuthorizedUserFooter dictionary={dictionary} user={user}/>
      )}/>
    );

  }
);