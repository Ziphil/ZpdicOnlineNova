/* eslint-disable react/jsx-closing-bracket-location */

import {faRocketLaunch} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";


export const AddTransferInvitationForm = create(
  require("../common.scss"), "AddTransferInvitationForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("addTransferInvitationForm");

    return (
      <form styleName="root" {...rest}>
        <div>
          <Button type="submit" scheme="red" variant="light">
            <ButtonIconbag><GeneralIcon icon={faRocketLaunch}/></ButtonIconbag>
            {trans("button.add")}
          </Button>
        </div>
      </form>
    );

  }
);