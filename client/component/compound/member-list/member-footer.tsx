//

import {faBan} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement} from "react";
import {Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, User} from "/server/internal/skeleton";
import {useDiscardMember} from "./member-list-hook";


export const MemberFooter = create(
  null, "MemberFooter",
  function ({
    dictionary,
    user
  }: {
    dictionary: DictionaryWithExecutors,
    user: User
  }): ReactElement {

    const {trans} = useTrans("memberList");

    const discardMember = useDiscardMember(dictionary, user);

    return (
      <Fragment>
        <Button scheme="red" variant="underline" onClick={discardMember}>
          <ButtonIconbag><GeneralIcon icon={faBan}/></ButtonIconbag>
          {trans("button.discard")}
        </Button>
      </Fragment>
    );

  }
);