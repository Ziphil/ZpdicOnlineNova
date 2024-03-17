/* eslint-disable react/jsx-closing-bracket-location */
//

import {ReactElement} from "react";
import {AdditionalProps, PageSpec, useTrans} from "zographia";
import {UserList} from "/client/component/compound/user-list";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {EnhancedDictionary} from "/client/skeleton";
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