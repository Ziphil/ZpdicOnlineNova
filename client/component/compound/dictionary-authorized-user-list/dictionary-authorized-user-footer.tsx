/* eslint-disable react/jsx-closing-bracket-location */
//

import {faBan} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, User} from "/client/skeleton";
import {useDiscardDictionaryAuthorizedUser} from "./dictionary-authorized-user-list-hook";


export const DictionaryAuthorizedUserFooter = create(
  null, "DictionaryAuthorizedUserFooter",
  function ({
    dictionary,
    user
  }: {
    dictionary: DictionaryWithExecutors,
    user: User
  }): ReactElement {

    const {trans} = useTrans("dictionaryAuthorizedUserList");

    const discardAuthorizedUser = useDiscardDictionaryAuthorizedUser(dictionary, user);

    return (
      <Fragment>
        <Button scheme="red" variant="underline" onClick={discardAuthorizedUser}>
          <ButtonIconbag><GeneralIcon icon={faBan}/></ButtonIconbag>
          {trans("button.discard")}
        </Button>
      </Fragment>
    );

  }
);