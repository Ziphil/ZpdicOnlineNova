//

import * as react from "react";
import {
  ReactElement,
  useCallback,
  useState
} from "react";
import Button from "/client/component/atom/button";
import Input from "/client/component/atom/input";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  createValidate
} from "/client/util/misc";
import {
  PopupUtil
} from "/client/util/popup";
import {
  validatePassword as rawValidatePassword
} from "/server/model/validation";


const ChangeUserPasswordForm = create(
  require("./change-user-password-form.scss"), "ChangeUserPasswordForm",
  function ({
    onSubmit
  }: {
    onSubmit?: () => void
  }): ReactElement {

    let [password, setPassword] = useState("");
    let [intl, {trans}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let handleClick = useCallback(async function (): Promise<void> {
      let response = await request("changeUserPassword", {password});
      if (response.status === 200) {
        addInformationPopup("userPasswordChanged");
        onSubmit?.();
      }
    }, [password, request, onSubmit, addInformationPopup]);

    let validate = createValidate(rawValidatePassword, PopupUtil.getMessage(intl, "invalidUserPassword"));
    let node = (
      <form styleName="root">
        <Input label={trans("changeUserPasswordForm.password")} type="flexible" value={password} validate={validate} useTooltip={true} onSet={(password) => setPassword(password)}/>
        <Button label={trans("changeUserPasswordForm.confirm")} reactive={true} onClick={handleClick}/>
      </form>
    );
    return node;

  }
);


export default ChangeUserPasswordForm;