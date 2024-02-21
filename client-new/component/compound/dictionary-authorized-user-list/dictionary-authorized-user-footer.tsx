/* eslint-disable react/jsx-closing-bracket-location */
//

import {faBan} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary, User} from "/client-new/skeleton";
import {useDiscardDictionaryAuthorizedUser} from "./dictionary-authorized-user-list-hook";


export const DictionaryAuthorizedUserFooter = create(
  null, "DictionaryAuthorizedUserFooter",
  function ({
    dictionary,
    user
  }: {
    dictionary: EnhancedDictionary,
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