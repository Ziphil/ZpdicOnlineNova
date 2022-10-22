//

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
  usePopup,
  useRequest,
  useTrans
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

    const [userName, setUserName] = useState("");
    const {trans} = useTrans("addTransferInvitationForm");
    const {request} = useRequest();
    const {addInformationPopup} = usePopup();

    const suggestUsers = useCallback(async function (pattern: string): Promise<Array<SuggestionSpec>> {
      const response = await request("suggestUsers", {pattern}, {ignoreError: true});
      if (response.status === 200 && !("error" in response.data)) {
        const users = response.data;
        const suggestions = users.map((user) => {
          const replacement = user.name;
          const node = <UserSuggestionPane user={user}/>;
          return {replacement, node};
        });
        return suggestions;
      } else {
        return [];
      }
    }, [request]);

    const handleClick = useCallback(async function (): Promise<void> {
      const type = "transfer" as const;
      const response = await request("addInvitation", {number, type, userName});
      if (response.status === 200) {
        addInformationPopup("transferInvitationAdded");
        onSubmit?.();
      }
    }, [number, userName, request, onSubmit, addInformationPopup]);

    const node = (
      <Fragment>
        <form styleName="root">
          <Input
            label={trans("userName")}
            value={userName}
            prefix="@"
            suggest={suggestUsers}
            onSet={(userName) => setUserName(userName)}
          />
          <Button label={trans("confirm")} reactive={true} onClick={handleClick}/>
        </form>
      </Fragment>
    );
    return node;

  }
);


export default AddTransferInvitationForm;