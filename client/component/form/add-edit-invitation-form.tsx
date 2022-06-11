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

    const [userName, setUserName] = useState("");
    const [authorizedUsers, setAuthorizedUsers] = useState<Array<User> | null>(null);
    const [, {trans}] = useIntl();
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const fetchAuthorizedUsers = useCallback(async function (): Promise<void> {
      const number = dictionary.number;
      const authority = "editOnly" as const;
      const response = await request("fetchDictionaryAuthorizedUsers", {number, authority});
      if (response.status === 200 && !("error" in response.data)) {
        const authorizedUsers = response.data;
        setAuthorizedUsers(authorizedUsers);
      } else {
        setAuthorizedUsers(null);
      }
    }, [dictionary.number, request]);

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
      const type = "edit" as const;
      const response = await request("addInvitation", {number, type, userName});
      if (response.status === 200) {
        addInformationPopup("editInvitationAdded");
        onSubmit?.();
      }
    }, [number, userName, request, onSubmit, addInformationPopup]);

    useMount(async () => {
      await fetchAuthorizedUsers();
    });

    const node = (
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