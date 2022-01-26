//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  SuggestionSpec
} from "/client/component/atom/input";
import UserSuggestionPane from "/client/component/compound/user-suggestion-pane";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  Dictionary
} from "/client/skeleton/dictionary";


const AddTransferInvitationForm = create(
  require("./add-transfer-invitation-form.scss"), "AddTransferInvitationForm",
  function ({
    number,
    dictionary,
    onSubmit
  }: {
    number: number,
    dictionary: Dictionary,
    onSubmit?: () => void
  }): ReactElement {

    let [userName, setUserName] = useState("");
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let suggestUsers = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      let response = await request("suggestUsers", {pattern}, {ignoreError: true});
      if (response.status === 200 && !("error" in response.data)) {
        let users = response.data;
        let suggestions = users.map((user) => {
          let replacement = user.name;
          let node = <UserSuggestionPane user={user}/>;
          return {replacement, node};
        });
        return suggestions;
      } else {
        return [];
      }
    }, [request]);

    let handleClick = useCallback(async function (): Promise<void> {
      let type = "transfer" as const;
      let response = await request("addInvitation", {number, type, userName});
      if (response.status === 200) {
        addInformationPopup("transferInvitationAdded");
        onSubmit?.();
      }
    }, [number, userName, request, onSubmit, addInformationPopup]);

    let node = (
      <Fragment>
        <form styleName="root">
          <Input
            label={trans("addTransferInvitationForm.userName")}
            value={userName}
            prefix="@"
            suggest={suggestUsers}
            onSet={(userName) => setUserName(userName)}
          />
          <Button label={trans("addTransferInvitationForm.confirm")} reactive={true} onClick={handleClick}/>
        </form>
      </Fragment>
    );
    return node;

  }
);


export default AddTransferInvitationForm;