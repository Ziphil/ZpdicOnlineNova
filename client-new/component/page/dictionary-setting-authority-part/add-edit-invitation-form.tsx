//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useSuspenseResponse} from "/client-new/hook/request";
import {Dictionary} from "/client-new/skeleton";


export const AddEditInvitationForm = create(
  require("./add-edit-invitation-form.scss"), "AddEditInvitationForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingEditingPart");

    const number = dictionary.number;
    const [authorizedUsers] = useSuspenseResponse("fetchDictionaryAuthorizedUsers", {number, authority: "editOnly"});

    return (
      <form styleName="root" {...rest}>
        {JSON.stringify(authorizedUsers)}
      </form>
    );

  }
);