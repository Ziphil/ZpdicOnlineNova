/* eslint-disable react/jsx-closing-bracket-location */

import {faRocketLaunch} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";


export const AddTransferInvitationForm = create(
  require("./add-edit-invitation-form.scss"), "AddTransferInvitationForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingEditingPart");

    return (
      <form styleName="root-table" {...rest}>
        <div>
          <Button type="submit" scheme="red" variant="light">
            <ButtonIconbag><GeneralIcon icon={faRocketLaunch}/></ButtonIconbag>
            {trans("button.transferInvitation.add")}
          </Button>
        </div>
      </form>
    );

  }
);