//

import * as react from "react";
import {
  Fragment,
  ReactElement,
  useCallback,
  useState
} from "react";
import {
  useMount
} from "react-use";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  SuggestionSpec
} from "/client/component/atom/input";
import UserList from "/client/component/compound/user-list";
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
import {
  User
} from "/client/skeleton/user";


const AddEditInvitationForm = create(
  require("./add-edit-invitation-form.scss"), "AddEditInvitationForm",
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
    let [authorizedUsers, setAuthorizedUsers] = useState<Array<User> | null>(null);
    let [, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let fetchAuthorizedUsers = useCallback(async function (): Promise<void> {
      let number = dictionary.number;
      let authority = "editOnly" as const;
      let response = await request("fetchDictionaryAuthorizedUsers", {number, authority});
      if (response.status === 200 && !("error" in response.data)) {
        let authorizedUsers = response.data;
        setAuthorizedUsers(authorizedUsers);
      } else {
        setAuthorizedUsers(null);
      }
    }, [dictionary.number, request]);

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
      let type = "edit" as const;
      let response = await request("addInvitation", {number, type, userName});
      if (response.status === 200) {
        addInformationPopup("editInvitationAdded");
        onSubmit?.();
      }
    }, [number, userName, request, onSubmit, addInformationPopup]);

    useMount(async () => {
      await fetchAuthorizedUsers();
    });

    let node = (
      <Fragment>
        <form styleName="root">
          <Input
            label={trans("addEditInvitationForm.userName")}
            value={userName}
            prefix="@"
            suggest={suggestUsers}
            onSet={(userName) => setUserName(userName)}
          />
          <Button label={trans("addEditInvitationForm.confirm")} reactive={true} onClick={handleClick}/>
        </form>
        <div styleName="user">
          <UserList users={authorizedUsers} dictionary={dictionary} size={8} onSubmit={fetchAuthorizedUsers}/>
        </div>
      </Fragment>
    );
    return node;

  }
);


export default AddEditInvitationForm;